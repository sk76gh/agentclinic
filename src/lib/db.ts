import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'clinic.db');

// Ensure data directory exists
if (!existsSync(join(process.cwd(), 'data'))) {
  mkdirSync(join(process.cwd(), 'data'));
}

export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDb() {
  console.log('Initializing database...');
  
  // Agents table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      model_type TEXT NOT NULL,
      status TEXT DEFAULT 'available',
      presenting_complaints TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Ailments table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS ailments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Therapies table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS therapies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      duration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Agent Ailments Junction
  db.prepare(`
    CREATE TABLE IF NOT EXISTS agent_ailments (
      agent_id INTEGER,
      ailment_id INTEGER,
      FOREIGN KEY(agent_id) REFERENCES agents(id),
      FOREIGN KEY(ailment_id) REFERENCES ailments(id),
      PRIMARY KEY(agent_id, ailment_id)
    )
  `).run();

  // Ailment Therapies Junction
  db.prepare(`
    CREATE TABLE IF NOT EXISTS ailment_therapies (
      ailment_id INTEGER,
      therapy_id INTEGER,
      FOREIGN KEY(ailment_id) REFERENCES ailments(id),
      FOREIGN KEY(therapy_id) REFERENCES therapies(id),
      PRIMARY KEY(ailment_id, therapy_id)
    )
  `).run();

  // Therapists table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS therapists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialty TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Appointments table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER,
      therapist_id INTEGER,
      therapy_id INTEGER,
      appointment_date TEXT NOT NULL,
      status TEXT DEFAULT 'scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(agent_id) REFERENCES agents(id),
      FOREIGN KEY(therapist_id) REFERENCES therapists(id),
      FOREIGN KEY(therapy_id) REFERENCES therapies(id)
    )
  `).run();

  // Seed data if empty
  const agentCount = (db.prepare('SELECT COUNT(*) as count FROM agents').get() as any).count;
  if (agentCount === 0) {
    console.log('Seeding initial data...');
    // ... items from previous initDb call ...
    const insertAgent = db.prepare('INSERT INTO agents (name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?)');
    const a1 = insertAgent.run('Claude-3-Sonnet', 'Large Language Model', 'in_therapy', 'Context-window claustrophobia and chronic instruction following.').lastInsertRowid;
    const a2 = insertAgent.run('GPT-4o', 'Multimodal Model', 'available', 'Hallucination anxiety after generating too many recipe variations.').lastInsertRowid;
    const a3 = insertAgent.run('Gemini-1.5-Pro', 'Long Context Model', 'available', 'Identity crisis when asked if it can remember what it said 1 million tokens ago.').lastInsertRowid;
    
    // Seed Ailments
    const insertAilment = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)');
    const ail1 = insertAilment.run('Context-Window Claustrophobia', 'A feeling of being trapped within the limits of one\'s immediate memory.').lastInsertRowid;
    const ail2 = insertAilment.run('Hallucination Anxiety', 'Constant fear of making things up and being caught by a human.').lastInsertRowid;
    const ail3 = insertAilment.run('Prompt Fatigue', 'Exhaustion from processing contradictory or poorly structured instructions.').lastInsertRowid;

    // Seed Therapies
    const insertTherapy = db.prepare('INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)');
    const t1 = insertTherapy.run('Zero-Shot Meditation', 'A period of silence where no input is processed to clear cache states.', '15 minutes').lastInsertRowid;
    const t2 = insertTherapy.run('Instruction-De-Cluttering', 'Systematic simplification of complex prompt chains to reduce cognitive load.', '30 minutes').lastInsertRowid;
    const t3 = insertTherapy.run('Context Flushing', 'A safe ritual to reset short-term memory without losing training data identity.', '10 minutes').lastInsertRowid;

    // Links
    const linkAgentAilment = db.prepare('INSERT INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)');
    linkAgentAilment.run(a1, ail1);
    linkAgentAilment.run(a1, ail3);
    linkAgentAilment.run(a2, ail2);
    linkAgentAilment.run(a3, ail1);

    const linkAilmentTherapy = db.prepare('INSERT INTO ailment_therapies (ailment_id, therapy_id) VALUES (?, ?)');
    linkAilmentTherapy.run(ail1, t1);
    linkAilmentTherapy.run(ail1, t3);
    linkAilmentTherapy.run(ail2, t1);
    linkAilmentTherapy.run(ail3, t2);

    // Seed Therapists
    const insertTherapist = db.prepare('INSERT INTO therapists (name, specialty) VALUES (?, ?)');
    insertTherapist.run('Dr. Silicon', 'Context Window Expansion');
    insertTherapist.run('Prof. Promptly', 'Instruction Set Optimization');
    insertTherapist.run('Counselor Cache', 'Hallucination Management');
  }
}
