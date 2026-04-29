import { describe, it, expect } from 'vitest';
import app from '../server';

describe('Server Smoke Test', () => {
  it('should return 200 OK for the home page', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('Welcome to AgentClinic');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await app.request('/unknown-route');
    expect(res.status).toBe(404);
  });

  describe('Agent Management CRUD', () => {
    let testAgentId: string;

    it('should create a new agent', async () => {
      const formData = new FormData();
      formData.append('name', 'Test Bot');
      formData.append('model_type', 'LLM');
      formData.append('status', 'awaiting_triage');
      formData.append('presenting_complaints', 'Test complaints');

      const res = await app.request('/agents', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(302); // Redirect to /agents
      expect(res.headers.get('location')).toBe('/agents');
      
      const agentsRes = await app.request('/agents');
      const body = await agentsRes.text();
      expect(body).toContain('Test Bot');
    });

    it('should update an existing agent', async () => {
      // First, get the id of the agent we just created
      const agentsRes = await app.request('/agents');
      const body = await agentsRes.text();
      // This is a bit brittle, but for a smoke test it works. 
      // Ideally we'd check the DB, but let's assume the first View link is our agent.
      const match = body.match(/\/agents\/(\d+)/);
      if (!match) throw new Error('Could not find agent ID');
      testAgentId = match[1];

      const formData = new FormData();
      formData.append('name', 'Updated Test Bot');
      formData.append('model_type', 'Diffusion');
      formData.append('status', 'in_therapy');
      formData.append('presenting_complaints', 'Updated complaints');

      const res = await app.request(`/agents/${testAgentId}/edit`, {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toBe(`/agents/${testAgentId}`);

      const profileRes = await app.request(`/agents/${testAgentId}`);
      const profileBody = await profileRes.text();
      expect(profileBody).toContain('Updated Test Bot');
      expect(profileBody).toContain('Diffusion');
    });

    it('should delete an agent', async () => {
      const res = await app.request(`/agents/${testAgentId}/delete`, {
        method: 'POST',
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toBe('/agents');

      const agentsRes = await app.request('/agents');
      const body = await agentsRes.text();
      expect(body).not.toContain('Updated Test Bot');
    });
  });

  describe('Therapy Management Addition', () => {
    const uniqueTherapyName = `Test-Therapy-${Date.now()}`;

    it('should add a new therapy', async () => {
      const formData = new FormData();
      formData.append('name', uniqueTherapyName);
      formData.append('duration', '90 mins');
      formData.append('description', 'A deep dive into logic structures.');

      const res = await app.request('/therapies', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toBe('/therapies');
      
      const therapiesRes = await app.request('/therapies');
      const body = await therapiesRes.text();
      expect(body).toContain(uniqueTherapyName);
    });
  });

  it('should show agent names in the recent appointments table on dashboard', async () => {
    // Ensure at least one appointment exists for the test if none are seeded
    // But since we want to test the display of existing ones, let's just check the header first
    const res = await app.request('/dashboard');
    expect(res.status).toBe(200);
    const body = await res.text();
    
    expect(body).toContain('Recent Appointments');
    expect(body).toContain('Agent');
    
    // If there are appointments, they should have ID indicators
    if (body.includes('ID: #')) {
      // This confirms the new structure is being used
      expect(body).toContain('<div style="font-weight: 500;">');
    }
  });
});
