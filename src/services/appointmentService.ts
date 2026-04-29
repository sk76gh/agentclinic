import { db } from '../lib/db';

export interface Appointment {
  id: number;
  agent_id: number;
  agent_name?: string;
  therapist_id: number;
  therapy_id: number;
  appointment_date: string;
  status: string;
  created_at: string;
}

export const appointmentService = {
  getAll(): Appointment[] {
    return db.prepare(`
      SELECT a.*, ag.name as agent_name 
      FROM appointments a
      JOIN agents ag ON a.agent_id = ag.id
      ORDER BY a.appointment_date DESC
    `).all() as Appointment[];
  },

  create(appointment: Omit<Appointment, 'id' | 'created_at' | 'status'>) {
    const info = db.prepare(`
      INSERT INTO appointments (agent_id, therapist_id, therapy_id, appointment_date)
      VALUES (?, ?, ?, ?)
    `).run(
      appointment.agent_id,
      appointment.therapist_id,
      appointment.therapy_id,
      appointment.appointment_date
    );
    return info.lastInsertRowid;
  },

  getStats() {
    const agents = (db.prepare('SELECT COUNT(*) as count FROM agents').get() as any).count;
    const appointments = (db.prepare('SELECT COUNT(*) as count FROM appointments').get() as any).count;
    const ailments = (db.prepare('SELECT COUNT(*) as count FROM ailments').get() as any).count;
    
    return { agents, appointments, ailments };
  }
};
