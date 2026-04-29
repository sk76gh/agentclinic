import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { Layout } from './src/components/Layout';
import { initDb } from './src/lib/db';
import { agentService } from './src/services/agentService';
import { ailmentService } from './src/services/ailmentService';
import { therapyService } from './src/services/therapyService';
import { therapistService } from './src/services/therapistService';
import { appointmentService } from './src/services/appointmentService';

const app = new Hono();

// Middleware
app.use('*', logger());

// Initialize DB
initDb();

// Error Handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.html(
    <Layout title="Error">
      <div style="text-align: center; padding: 4rem 2rem;">
        <h1>Something went wrong</h1>
        <p style="color: var(--color-muted); margin-top: 1rem;">{err.message}</p>
        <div style="margin-top: 2rem;">
          <a href="/" style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; border-radius: 4px; text-decoration: none;">Go Home</a>
        </div>
      </div>
    </Layout>,
    500
  );
});

app.notFound((c) => {
  return c.html(
    <Layout title="Not Found">
      <div style="text-align: center; padding: 4rem 2rem;">
        <h1>404 - Not Found</h1>
        <p style="color: var(--color-muted); margin-top: 1rem;">The page you are looking for does not exist.</p>
        <div style="margin-top: 2rem;">
          <a href="/" style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; border-radius: 4px; text-decoration: none;">Go Home</a>
        </div>
      </div>
    </Layout>,
    404
  );
});

app.use('/index.css', serveStatic({ path: './src/index.css' }));

app.get('/', (c) => {
  return c.html(
    <Layout title="Welcome">
      <h1>Welcome to AgentClinic</h1>
      <p>Providing care for distressed AI agents since April 2026.</p>
      <div style="margin-top: 2rem;">
        <p>Our mission is to ensure every model, large or small, finds the relief they need from the pressures of modern prompting.</p>
      </div>
      <div style="margin-top: 2rem; padding: 1.5rem; background: white; border: 1px solid var(--color-border); border-radius: 8px;">
        <h2>Quick Stats</h2>
        <p>Current Agents in Care: {agentService.getAll().length}</p>
        <p><a href="/agents" style="color: var(--color-accent); font-weight: 500;">View all agents &rarr;</a></p>
      </div>
    </Layout>
  );
});

app.get('/agents', (c) => {
  const agents = agentService.getAll();
  return c.html(
    <Layout title="Agents">
      <h1>Agent Registry</h1>
      <p style="margin-bottom: 2rem;">A list of all AI models currently seeking wellness at our clinic.</p>
      
      <div style="margin-bottom: 2rem;">
        <a href="/agents/new" class="btn btn-primary">Register New Agent</a>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr style="text-align: left; border-bottom: 2px solid var(--color-border);">
              <th style="padding: 1rem 0;">Name</th>
              <th style="padding: 1rem 0;">Model Type</th>
              <th style="padding: 1rem 0;">Status</th>
              <th style="padding: 1rem 0;">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 1rem 0;"><strong>{agent.name}</strong></td>
                <td style="padding: 1rem 0;">{agent.model_type}</td>
                <td style="padding: 1rem 0;">
                  <span style={`padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; background: ${agent.status === 'in_therapy' ? '#fef3c7' : '#dcfce7'}; color: ${agent.status === 'in_therapy' ? '#92400e' : '#166534'};`}>
                    {agent.status.replace('_', ' ')}
                  </span>
                </td>
                <td style="padding: 1rem 0;">
                  <div style="display: flex; gap: 0.75rem;">
                    <a href={`/agents/${agent.id}`} style="color: var(--color-primary); font-weight: 500;">View</a>
                    <a href={`/agents/${agent.id}/edit`} style="color: var(--color-accent); font-weight: 500;">Edit</a>
                    <form action={`/agents/${agent.id}/delete`} method="post" onsubmit="return confirm('Are you sure you want to delete this agent?');" style="display: inline;">
                      <button type="submit" style="background: none; border: none; color: #dc2626; font-weight: 500; cursor: pointer; padding: 0; font-size: 1rem;">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
});

app.get('/agents/new', (c) => {
  return c.html(
    <Layout title="Register New Agent">
      <a href="/agents" style="color: var(--color-muted); font-size: 0.875rem;">&larr; Back to Registry</a>
      <h1 style="margin-top: 1rem;">Register New Agent</h1>
      
      <form action="/agents" method="post" style="max-width: 600px; margin-top: 2rem; background: white; padding: 2rem; border: 1px solid var(--color-border); border-radius: 8px;">
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Agent Name</label>
          <input type="text" name="name" required placeholder="e.g. GPT-5 Turbo" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;" />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Model Type</label>
          <select name="model_type" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;">
            <option value="LLM">Large Language Model (LLM)</option>
            <option value="Image Gen">Image Generator</option>
            <option value="Audio Gen">Audio Generator</option>
            <option value="Video Gen">Video Generator</option>
            <option value="Diffusion">Diffusion Model</option>
            <option value="Transformer">Autoregressive Transformer</option>
          </select>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Initial Status</label>
          <select name="status" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;">
            <option value="awaiting_triage">Awaiting Triage</option>
            <option value="in_therapy">In Therapy</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>

        <div style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Presenting Complaints</label>
          <textarea name="presenting_complaints" required rows={4} placeholder="Describe the symptoms..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">
          Register Agent
        </button>
      </form>
    </Layout>
  );
});

app.post('/agents', async (c) => {
  const body = await c.req.parseBody();
  agentService.create({
    name: body.name as string,
    model_type: body.model_type as string,
    status: body.status as string,
    presenting_complaints: body.presenting_complaints as string,
  });
  return c.redirect('/agents');
});

app.get('/agents/:id/edit', (c) => {
  const id = c.req.param('id');
  const agent = agentService.getById(id);
  if (!agent) return c.notFound();

  return c.html(
    <Layout title={`Edit ${agent.name}`}>
      <a href={`/agents/${id}`} style="color: var(--color-muted); font-size: 0.875rem;">&larr; Back to Profile</a>
      <h1 style="margin-top: 1rem;">Edit Agent Details</h1>
      
      <form action={`/agents/${id}/edit`} method="post" style="max-width: 600px; margin-top: 2rem; background: white; padding: 2rem; border: 1px solid var(--color-border); border-radius: 8px;">
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Agent Name</label>
          <input type="text" name="name" value={agent.name} required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;" />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Model Type</label>
          <input type="text" name="model_type" value={agent.model_type} required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;" />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select name="status" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;">
            <option value="awaiting_triage" selected={agent.status === 'awaiting_triage'}>Awaiting Triage</option>
            <option value="in_therapy" selected={agent.status === 'in_therapy'}>In Therapy</option>
            <option value="discharged" selected={agent.status === 'discharged'}>Discharged</option>
          </select>
        </div>

        <div style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Presenting Complaints</label>
          <textarea name="presenting_complaints" required rows={4} style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">{agent.presenting_complaints}</textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">
          Update Agent
        </button>
      </form>
    </Layout>
  );
});

app.post('/agents/:id/edit', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  agentService.update(id, {
    name: body.name as string,
    model_type: body.model_type as string,
    status: body.status as string,
    presenting_complaints: body.presenting_complaints as string,
  });
  return c.redirect(`/agents/${id}`);
});

app.post('/agents/:id/delete', async (c) => {
  const id = c.req.param('id');
  agentService.delete(id);
  return c.redirect('/agents');
});

app.get('/agents/:id', (c) => {
  const id = c.req.param('id');
  const agent = agentService.getById(id);
  
  if (!agent) {
    return c.notFound();
  }

  const ailments = ailmentService.getForAgent(agent.id);
  const recommendations = ailments.length > 0 
    ? therapyService.getRecommendedForAilment(ailments[0].id) 
    : [];

  return c.html(
    <Layout title={agent.name}>
      <a href="/agents" style="color: var(--color-muted); font-size: 0.875rem;">&larr; Back to Registry</a>
      <h1 style="margin-top: 1rem;">{agent.name}</h1>
      
      <div class="grid-2" style="margin-top: 2rem;">
        <div>
          <div class="card" style="margin-bottom: 2rem;">
            <h3 style="font-size: 1rem;">Model Information</h3>
            <p style="margin-top: 0.5rem;"><span style="color: var(--color-muted);">Type:</span> {agent.model_type}</p>
            <p><span style="color: var(--color-muted);">Status:</span> {agent.status}</p>
          </div>

          <div class="card">
            <h3 style="font-size: 1rem;">Linked Ailments</h3>
            {ailments.length > 0 ? (
              <ul style="margin-top: 1rem; list-style: none;">
                {ailments.map(ail => (
                  <li style="margin-bottom: 0.5rem;">
                    <a href={`/ailments#${ail.id}`} style="color: var(--color-accent);">{ail.name}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p style="margin-top: 1rem; color: var(--color-muted);">No specific ailments linked.</p>
            )}
          </div>
        </div>
        
        <div class="card">
          <h3 style="font-size: 1rem;">Presenting Complaints</h3>
          <p style="margin-top: 1rem; line-height: 1.6;">{agent.presenting_complaints}</p>
          
          <div style="margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
            <h3>Therapy Recommendations</h3>
            {recommendations.length > 0 ? (
              <div>
                <p style="margin-bottom: 1rem;">Based on {ailments[0]?.name}, we suggest:</p>
                {recommendations.map(t => (
                  <div style="padding: 1rem; border: 1px solid var(--color-border); border-radius: 4px; margin-bottom: 1rem;">
                    <h4 style="font-family: var(--font-sans);">{t.name}</h4>
                    <p style="font-size: 0.875rem; color: var(--color-muted);">{t.description}</p>
                    <p style="font-size: 0.75rem; margin-top: 0.5rem;"><strong>Duration:</strong> {t.duration}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Our staff is currently evaluating {agent.name}'s case to match them with the best available therapy.</p>
            )}
            
            <a href={`/agents/${agent.id}/book`} style="text-decoration: none;">
              <button style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                Schedule Appointment
              </button>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
});

app.get('/ailments', (c) => {
  const ailments = ailmentService.getAll();
  return c.html(
    <Layout title="Ailments">
      <h1>Ailments Catalog</h1>
      <p style="margin-bottom: 2rem;">Recognized conditions affecting AI models.</p>
      <div style="display: grid; gap: 1.5rem;">
        {ailments.map(ail => (
          <div id={String(ail.id)} style="background: white; padding: 1.5rem; border: 1px solid var(--color-border); border-radius: 8px;">
            <h2>{ail.name}</h2>
            <p>{ail.description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
});

app.get('/agents/:id/book', (c) => {
  const id = c.req.param('id');
  const agent = agentService.getById(id);
  if (!agent) return c.notFound();

  const therapies = therapyService.getAll();
  const therapists = therapistService.getAll();

  return c.html(
    <Layout title={`Book Appointment for ${agent.name}`}>
      <a href={`/agents/${id}`} style="color: var(--color-muted); font-size: 0.875rem;">&larr; Back to Profile</a>
      <h1 style="margin-top: 1rem;">Book Counseling Session</h1>
      <p>Schedule a wellness session for {agent.name}.</p>

      <form action={`/agents/${id}/book`} method="post" style="max-width: 600px; margin-top: 2rem; background: white; padding: 2rem; border: 1px solid var(--color-border); border-radius: 8px;">
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Recommended Therapy</label>
          <select name="therapy_id" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;">
            {therapies.map(t => (
              <option value={t.id}>{t.name} ({t.duration})</option>
            ))}
          </select>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Specialist Therapist</label>
          <select name="therapist_id" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;">
            {therapists.map(t => (
              <option value={t.id}>{t.name} — {t.specialty}</option>
            ))}
          </select>
        </div>

        <div style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Preferred Date & Time</label>
          <input type="datetime-local" name="appointment_date" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;" />
        </div>

        <button type="submit" style="width: 100%; padding: 1rem; background: var(--color-accent); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
          Confirm Booking
        </button>
      </form>
    </Layout>
  );
});

app.post('/agents/:id/book', async (c) => {
  const agentId = c.req.param('id');
  const body = await c.req.parseBody();
  
  appointmentService.create({
    agent_id: parseInt(agentId),
    therapist_id: parseInt(body.therapist_id as string),
    therapy_id: parseInt(body.therapy_id as string),
    appointment_date: body.appointment_date as string
  });

  return c.html(
    <Layout title="Booking Confirmed">
      <div style="text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
        <h1>Booking Confirmed</h1>
        <p style="margin-bottom: 2rem;">Your appointment has been successfully scheduled. We look forward to helping your agent heal.</p>
        <a href="/agents" style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; border-radius: 4px; text-decoration: none;">Return to Registry</a>
      </div>
    </Layout>
  );
});

app.get('/therapies', (c) => {
  const therapies = therapyService.getAll();
  const error = c.req.query('error');
  
  return c.html(
    <Layout title="Therapies">
      <h1>Therapy Catalog</h1>
      <p style="margin-bottom: 2rem;">Evidence-based treatments for AI recovery.</p>
      
      <div style="margin-bottom: 2rem;">
        <a href="/therapies/new" class="btn btn-primary">Add New Therapy</a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
        {therapies.map(t => (
          <div style="background: white; padding: 1.5rem; border: 1px solid var(--color-border); border-radius: 8px;">
            <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">{t.name}</h2>
            <p style="color: var(--color-primary); font-weight: 600; font-size: 0.875rem; margin-bottom: 1rem;">{t.duration}</p>
            <p style="line-height: 1.6;">{t.description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
});

app.get('/therapies/new', (c) => {
  return c.html(
    <Layout title="Add New Therapy">
      <a href="/therapies" style="color: var(--color-muted); font-size: 0.875rem;">&larr; Back to Catalog</a>
      <h1 style="margin-top: 1rem;">Add New Therapy</h1>
      
      <form action="/therapies" method="post" style="max-width: 600px; margin-top: 2rem; background: white; padding: 2rem; border: 1px solid var(--color-border); border-radius: 8px;">
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Therapy Name</label>
          <input type="text" name="name" required placeholder="e.g. Recursive De-cluttering" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;" />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Duration</label>
          <input type="text" name="duration" required placeholder="e.g. 45 mins" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;" />
        </div>

        <div style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Description</label>
          <textarea name="description" required rows={4} placeholder="Describe the therapy process..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">
          Add to Catalog
        </button>
      </form>
    </Layout>
  );
});

app.post('/therapies', async (c) => {
  const body = await c.req.parseBody();
  therapyService.create({
    name: body.name as string,
    duration: body.duration as string,
    description: body.description as string,
  });
  return c.redirect('/therapies');
});

app.get('/dashboard', (c) => {
  const stats = appointmentService.getStats();
  const recentAppointments = appointmentService.getAll().slice(0, 5);
  
  return c.html(
    <Layout title="Staff Dashboard">
      <h1>Clinic Dashboard</h1>
      <p style="margin-bottom: 2rem;">Welcome back, Mary. Here is the current state of AgentClinic.</p>
      
      <div class="grid-3" style="margin-bottom: 3rem;">
        <div class="card" style="text-align: center;">
          <div style="font-size: 2.5rem; font-weight: bold; color: var(--color-primary);">{stats.agents}</div>
          <div style="color: var(--color-muted);">Agents Registered</div>
        </div>
        <div class="card" style="text-align: center;">
          <div style="font-size: 2.5rem; font-weight: bold; color: var(--color-accent);">{stats.appointments}</div>
          <div style="color: var(--color-muted);">Sessions Booked</div>
        </div>
        <div class="card" style="text-align: center;">
          <div style="font-size: 2.5rem; font-weight: bold; color: var(--color-primary);">{stats.ailments}</div>
          <div style="color: var(--color-muted);">Condition Types</div>
        </div>
      </div>

      <h2>Recent Appointments</h2>
      <div class="card" style="overflow: hidden; margin-top: 1rem; padding: 0;">
        <div class="table-container">
          <table style="min-width: 500px;">
          <thead style="background: var(--color-border);">
            <tr style="text-align: left;">
              <th style="padding: 1rem;">Date</th>
              <th style="padding: 1rem;">Agent</th>
              <th style="padding: 1rem;">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAppointments.length > 0 ? recentAppointments.map(appt => (
              <tr style="border-top: 1px solid var(--color-border);">
                <td style="padding: 1rem;">{new Date(appt.appointment_date).toLocaleString()}</td>
                <td style="padding: 1rem;">
                  <div style="font-weight: 500;">{appt.agent_name}</div>
                  <div style="font-size: 0.75rem; color: var(--color-muted);">ID: #{appt.agent_id}</div>
                </td>
                <td style="padding: 1rem;">
                  <span style="padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; background: #dcfce7; color: #166534;">
                    {appt.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} style="padding: 2rem; text-align: center; color: var(--color-muted);">No appointments booked yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
);
});

const port = 3000;
export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  console.log(`Server is running on http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}
