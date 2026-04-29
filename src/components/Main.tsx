import { Child } from 'hono/jsx';

export const Main = ({ children }: { children: Child }) => (
  <main>
    {children}
  </main>
);
