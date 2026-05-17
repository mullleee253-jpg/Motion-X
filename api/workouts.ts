import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './lib/mongodb';

export default async (req: VercelRequest, res: VercelResponse) => {
  // 🛡 SECURITY: Проверка авторизации на уровне сервера
  const authHeader = req.headers['authorization'];
  const ADMIN_SECRET = 'motonx-key-99'; // В идеале вынести в ENV

  if (req.method !== 'GET' && authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Admin Token' });
  }

  const client = await clientPromise;
  const db = client.db('motonx');
  const collection = db.collection('workouts');

  // 📝 VALIDATION: Проверка данных при создании
  if (req.method === 'POST') {
    const { title, steps, emoji } = req.body;
    if (!title || !steps || !emoji || !Array.isArray(steps)) {
      return res.status(400).json({ message: 'Validation Failed: Missing required fields' });
    }
  }

  if (req.method === 'GET') {
    const workouts = await collection.find({}).toArray();
    return res.status(200).json(workouts);
  }

  if (req.method === 'POST') {
    const newWorkout = req.body;
    await collection.insertOne(newWorkout);
    return res.status(201).json({ message: 'Workout saved to Mongo!' });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await collection.deleteOne({ id: Number(id) });
    return res.status(200).json({ message: 'Deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
