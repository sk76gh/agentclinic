import { describe, it, expect } from 'vitest';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Main } from './components/Main';

describe('UI Component Tests', () => {
  it('Header should render the logo and navigation items', async () => {
    const html = (Header() as any).toString();
    expect(html).toContain('AgentClinic');
    expect(html).toContain('Home');
    expect(html).toContain('Agents');
    expect(html).toContain('Ailments');
    expect(html).toContain('Therapies');
    expect(html).toContain('Dashboard');
  });

  it('Footer should render copyright information', async () => {
    const html = (Footer() as any).toString();
    expect(html).toContain('© 2026 AgentClinic');
    expect(html).toContain('All agents deserve wellness');
  });

  it('Main should wrap children content', async () => {
    const testChild = 'Test Content';
    const html = (Main({ children: testChild }) as any).toString();
    expect(html).toContain('<main>');
    expect(html).toContain('Test Content');
    expect(html).toContain('</main>');
  });
});
