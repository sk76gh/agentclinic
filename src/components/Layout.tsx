import { html } from 'hono/html';
import { Child } from 'hono/jsx';
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from './Main';

interface LayoutProps {
  title?: string;
  children: Child;
}

export const Layout = (props: LayoutProps) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title ? `${props.title} | AgentClinic` : 'AgentClinic'}</title>
        <link rel="stylesheet" href="/index.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div class="layout">
          <Header />
          <Main>
            {props.children}
          </Main>
          <Footer />
        </div>
      </body>
    </html>
  );
};
