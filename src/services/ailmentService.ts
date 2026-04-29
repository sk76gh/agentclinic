import { db } from '../lib/db';

export interface Ailment {
  id: number;
  name: string;
  description: string;
}

export const ailmentService = {
  getAll(): Ailment[] {
    return db.prepare('SELECT * FROM ailments').all() as Ailment[];
  },

  getById(id: number | string): Ailment | undefined {
    return db.prepare('SELECT * FROM ailments WHERE id = ?').get(id) as Ailment | undefined;
  },

  getForAgent(agentId: number | string): Ailment[] {
    return db.prepare(`
      SELECT a.* FROM ailments a
      JOIN agent_ailments aa ON a.id = aa.ailment_id
      WHERE aa.agent_id = ?
    `).all(agentId) as Ailment[];
  }
};
