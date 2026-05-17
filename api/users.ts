import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './lib/mongodb.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  const client = await clientPromise;
  const db = client.db('motonx');
  const collection = db.collection('users');

  if (req.method === 'GET') {
    const users = await collection.find({}).toArray();
    // Убираем пароли перед отправкой админу
    const safeUsers = users.map(({ password, ...u }) => u);
    return res.status(200).json(safeUsers);
  }

  if (req.method === 'POST') {
    const { username, password, isPremium, action } = req.body;
    
    // LOGIN ACTION
    if (action === 'login') {
      const user = await collection.findOne({ 
        username: username.toLowerCase(),
        password 
      });
      if (user) {
        const { password: _, ...safeUser } = user;
        return res.status(200).json(safeUser);
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // REGISTER ACTION
    // Проверка на существование
    const existing = await collection.findOne({ username: username.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User exists' });

    await collection.insertOne({
      username: username.toLowerCase(),
      password,
      isPremium: isPremium || false,
      createdAt: Date.now()
    });
    return res.status(201).json({ success: true });
  }

  if (req.method === 'PUT') {
    const { username, isPremium } = req.body;
    await collection.updateOne(
      { username: username.toLowerCase() },
      { $set: { isPremium } }
    );
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
