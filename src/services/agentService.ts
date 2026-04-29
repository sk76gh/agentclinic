import { db } from '../lib/db';

export interface Agent {
  id: number;
  name: string;
  model_type: string;
  status: string;
  presenting_complaints: string;
  created_at: string;
}

export const agentService = {
  getAll(): Agent[] {
    return db.prepare('SELECT * FROM agents ORDER BY created_at DESC').all() as Agent[];
  },

  getById(id: number | string): Agent | undefined {
    return db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined;
  },

  create(agent: Omit<Agent, 'id' | 'created_at'>) {
    const info = db.prepare('INSERT INTO agents (name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?)').run(
      agent.name,
      agent.model_type,
      agent.status,
      agent.presenting_complaints
    );
    return info.lastInsertRowid;
  },

  update(id: number | string, agent: Partial<Omit<Agent, 'id' | 'created_at'>>) {
    const fields = Object.keys(agent).map(key => `${key} = ?`).join(', ');
    const values = Object.values(agent);
    return db.prepare(`UPDATE agents SET ${fields} WHERE id = ?`).run(...values, id);
  },

  delete(id: number | string) {
    return db.prepare('DELETE FROM agents WHERE id = ?').run(id);
  }
};
