import { db } from '../lib/db';

export interface Therapy {
  id: number;
  name: string;
  description: string;
  duration: string;
}

export const therapyService = {
  getAll(): Therapy[] {
    return db.prepare('SELECT * FROM therapies').all() as Therapy[];
  },

  getById(id: number | string): Therapy | undefined {
    return db.prepare('SELECT * FROM therapies WHERE id = ?').get(id) as Therapy | undefined;
  },

  getRecommendedForAilment(ailmentId: number | string): Therapy[] {
    return db.prepare(`
      SELECT t.* FROM therapies t
      JOIN ailment_therapies at ON t.id = at.therapy_id
      WHERE at.ailment_id = ?
    `).all(ailmentId) as Therapy[];
  },

  create(therapy: Omit<Therapy, 'id'>) {
    const info = db.prepare('INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)').run(
      therapy.name,
      therapy.description,
      therapy.duration
    );
    return info.lastInsertRowid;
  },

  update(id: number | string, therapy: Partial<Omit<Therapy, 'id'>>) {
    const fields = Object.keys(therapy).map(key => `${key} = ?`).join(', ');
    const values = Object.values(therapy);
    return db.prepare(`UPDATE therapies SET ${fields} WHERE id = ?`).run(...values, id);
  },

  delete(id: number | string) {
    const deleteLinks = db.prepare('DELETE FROM ailment_therapies WHERE therapy_id = ?');
    const deleteTherapy = db.prepare('DELETE FROM therapies WHERE id = ?');
    
    const transaction = db.transaction((id: number | string) => {
      deleteLinks.run(id);
      deleteTherapy.run(id);
    });
    
    return transaction(id);
  }
};
