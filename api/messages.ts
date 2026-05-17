import { VercelRequest, VercelResponse } from '@vercel.node';
import clientPromise from './lib/mongodb';

export default async (req: VercelRequest, res: VercelResponse) => {
  const client = await clientPromise;
  const db = client.db('motonx');
  const collection = db.collection('messages');

  if (req.method === 'GET') {
    const messages = await collection.find({}).sort({ timestamp: 1 }).toArray();
    return res.status(200).json(messages);
  }

  if (req.method === 'POST') {
    const newMessage = req.body;
    await collection.insertOne({
      ...newMessage,
      timestamp: Date.now()
    });
    return res.status(201).json({ success: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
