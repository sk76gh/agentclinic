import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Branding and Visual Identity', () => {
  it('should have the correct primary orange color in CSS', () => {
    const cssPath = join(process.cwd(), 'src', 'index.css');
    const cssContent = readFileSync(cssPath, 'utf8');
    
    // Check for orange primary color
    expect(cssContent).toContain('--color-primary: #f97316');
  });

  it('should have deep black as the accent color in CSS', () => {
    const cssPath = join(process.cwd(), 'src', 'index.css');
    const cssContent = readFileSync(cssPath, 'utf8');
    
    // Check for black accent color
    expect(cssContent).toContain('--color-accent: #000000');
  });

  it('should use the serif font for headings (Playfair Display)', () => {
    const cssPath = join(process.cwd(), 'src', 'index.css');
    const cssContent = readFileSync(cssPath, 'utf8');
    
    expect(cssContent).toContain("--font-serif: 'Playfair Display', serif");
    expect(cssContent).toContain('font-family: var(--font-serif)');
  });
});
