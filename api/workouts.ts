import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './lib/mongodb';

export default async (req: VercelRequest, res: VercelResponse) => {
  const client = await clientPromise;
  const db = client.db('motonx');
  const collection = db.collection('workouts');

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
