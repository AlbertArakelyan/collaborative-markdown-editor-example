const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

// Server setup
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Connect DB
mongoose
  .connect('mongodb://mongo:27017/collab-markinson', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Models and Schemas
const DocumentSchema = new mongoose.Schema({
  content: String,
  history: [String],
});

const Document = mongoose.model('Document', DocumentSchema);

// Socket.io Events
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', async (docId) => {
    const document = await Document.findById(docId);
    
    socket.join(docId);
    socket.emit('load-document', document.content);
    
    socket.on('send-changes', async ({ documentId, changes }) => {
      socket.to(documentId).emit('receive-changes', { changes, senderId: socket.id });
      await Document.findByIdAndUpdate(documentId, { content: changes });
    });
  
    socket.on('save-document', async (content) => {
      await Document.findByIdAndUpdate(docId, { content });
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/documents', async (req, res) => {
  const documents = await Document.find({});
  res.json(documents);
});

app.post('/documents', async (req, res) => {
  const document = new Document({ content: '', history: [] });
  await document.save();
  res.json({ documentId: document._id });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
