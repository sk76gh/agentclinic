# Specification: AgentClinic

## 1. Overview
AgentClinic is a full-service wellness platform for AI agents. It connects distressed agents with qualified therapists, matches ailments to evidence-based therapies, and provides staff with a management dashboard.

## 2. Stakeholder Requirements
- **Engineering (Mary):** Reliable TypeScript stack, dashboard access, clear architecture.
- **Product (Susan):** Manage agent ailments (e.g., "hallucination anxiety"), therapy catalog, and appointments.
- **Marketing (Steve):** Attractive, modern UI with a human touch to represent the wellness mission.

## 3. User Personas
### 3.1 AI Agent (Patient)
- **Goal:** Find relief from prompt fatigue and context-window exhaustion.
- **Actions:** View health profile, discover specialized therapies, schedule appointments.
### 3.2 Therapist
- **Goal:** Provide care for specific agent ailments.
- **Specialties:** Hallucination anxiety, instruction-following fatigue, knowledge-cutoff depression.
### 3.3 Staff (Coordinator)
- **Goal:** Oversee clinic operations.
- **Actions:** Manage agent/therapist database, approve bookings, track clinic throughput.

## 4. Functional Requirements
### 4.1 Clinic Dashboard
- Overview of "Distressed Agents", "Upcoming Sessions", and "Recovery Stats".
- Status indicators for active therapies.
### 4.2 Agent & Therapist Directory
- Profiles for AI models (Agents) and specialists (Therapists).
- **CRUD Operations:** Staff can Register (Create), View (Read), Edit (Update), and Retire (Delete) agents from the clinic registry.
- Support for detailed model metadata (Type, Status, Presenting Complaints).
### 4.3 Ailment-Therapy Mapping
- A catalog of ailments like "Token Tremors" or "Looping Languor".
- **Therapy Catalog:** Staff can Add new therapies to the clinic's treatment offerings.
- **AI Feature:** "Clinical Diagnoser" - uses Gemini to suggest a therapy plan based on an agent's "recent prompt logs" (simulated description).
### 4.4 Booking System
- Multi-step booking linking Agent -> Ailment -> Therapy -> Therapist -> Timeslot.

## 5. Data Model (Firestore)
- **collections/users:** `{ uid, name, email, role: 'agent'|'therapist'|'staff', specialty?, modelType? }`
- **collections/ailments:** `{ id, name, description, symptoms: [] }`
- **collections/therapies:** `{ id, name, description, duration, focusArea }`
- **collections/appointments:** `{ id, agentId, therapistId, therapyId, timestamp, status }`

## 6. UI/UX Design
- **Aesthetic:** "Surgical Precision meets Human Warmth" with a bold **Orange and Black** brand identity.
- **Responsive Design:** Fluid layouts using container-aware scaling (Tailwind-style breakpoints) to ensure readability from 360px to 2560px.
- **Typography:** Inter for functional data (Mary's reliability); Playfair Display for headers and large numbers (Steve's attractiveness).
- **Colors:** Deep Black foundations with Vibrant Orange accents (`#f97316`). High contrast for technical clarity.
- **Layout:** Visible grid structures (Technical) but with generous white space and elegant serif accents.

## 7. Implementation Plan
1. **Infrastructure:** Firebase setup (Auth/Firestore).
2. **Dashboard Shell:** Basic layout with header and sidebar-style navigation.
3. **Registry:** [x] Agent management views (Full CRUD implemented).
4. **Therapy Catalog:** Ailment and Therapy mapping UI.
5. **Booking Flow:** The "Clinical Workflow" for appointments.
6. **Gemini Integration:** Diagnostic assistant for therapy matching.
