# Plan - Phase 1: Hello Hono

## Task Groups

### 1. Environment Setup
1. [x] Install dependencies: `hono`, `@hono/node-server`.
2. [x] Install dev dependencies: `tsx`.
3. [x] Update `package.json` scripts to use `tsx` for the `dev` command.

### 2. Implementation
1. [x] Create `server.tsx` as the entry point.
2. [x] Initialize a `new Hono()` instance.
3. [x] Implement a root route (`/`) that returns a plain text message: "AgentClinic is open for business".
4. [x] Use `serve` from `@hono/node-server` to start the server on port 3000.

### 3. Verification
1. [x] Start the dev server.
2. [x] Verify the root route responds in the browser with the new home page UI.
3. [x] Run `npm test` to verify automated smoke tests and component unit tests pass.

### 4. Modular Layout Implementation
1. [x] Create specific component files for `Header.tsx`, `Footer.tsx`, and `Main.tsx`.
2. [x] Integrate subcomponents into a master `Layout.tsx` shell.
3. [x] Ensure `src/index.css` contains all foundational structural styles.
4. [x] Serve `src/index.css` as a static asset in `server.tsx` and link it in the `Layout` component.

### 5. Automated Testing
1. [x] Configure `vitest` in `package.json` (already done).
2. [x] Create `src/server.test.ts` to verify the root route returns 200 OK.
3. [x] Create `src/components.test.tsx` to verify modular UI components render correctly.
4. [x] Create `src/branding.test.ts` to verify orange and black brand identity is applied in CSS.

### 6. Agent Management (CRUD)
1. [x] Implement `POST /agents` to create new agents.
2. [x] Implement `POST /agents/:id/edit` (and `GET /agents/:id/edit`) for updates.
3. [x] Implement `POST /agents/:id/delete` for removals.
4. [x] Create a management dashboard or add "Manage" buttons to the registry.
5. [x] Add automated tests for CRUD operations in `src/server.test.ts`.

### 7. Therapy Management
1. [x] Implement Add logic in `therapyService.ts`.
2. [x] Add `GET /therapies/new` and `POST /therapies` routes.
3. [x] Create forms for therapy data entry.
4. [x] Add automated tests for Therapy Addition in `src/server.test.ts`.
