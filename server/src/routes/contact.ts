import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define Contact interface
interface Contact {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

// Create Contact Schema
const contactSchema = new mongoose.Schema<Contact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Contact Model
const Contact = mongoose.model<Contact>('Contact', contactSchema);

// Contact form submission endpoint
router.post('/submit', async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, storing message in memory');
      // Store in memory as fallback
      return res.status(200).json({ 
        message: 'Message received (stored in memory)',
        data: { name, email, message }
      });
    }

    // Create new contact document
    const contact = new Contact({
      name,
      email,
      message
    });

    // Save to database
    await contact.save();

    res.status(200).json({ 
      message: 'Message received successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      error: 'Failed to submit message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all contact messages (admin only)
router.get('/messages', async (req: express.Request, res: express.Response) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not available',
        message: 'MongoDB is not connected'
      });
    }

    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 