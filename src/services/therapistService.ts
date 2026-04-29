import { db } from '../lib/db';

export interface Therapist {
  id: number;
  name: string;
  specialty: string;
}

export const therapistService = {
  getAll(): Therapist[] {
    return db.prepare('SELECT * FROM therapists').all() as Therapist[];
  },
  
  getById(id: number | string): Therapist | undefined {
    return db.prepare('SELECT * FROM therapists WHERE id = ?').get(id) as Therapist | undefined;
  }
};
