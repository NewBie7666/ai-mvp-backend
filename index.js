// index.js ES Module 版本
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// HTTP 接口
app.post('/task', (req, res) => {
  console.log('Received HTTP task:', req.body);
  res.json({ status: 'ok' });
});

// 绑定 0.0.0.0
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Worker connected');

  ws.on('message', (msg) => {
    console.log('Worker message:', msg.toString());
    let data;
    try {
      data = JSON.parse(msg.toString());
    } catch (e) {
      data = { type: 'unknown', raw: msg.toString() };
    }
    const result = {
      type: 'job_result',
      job_id: data.job_id || 'test',
      result: { message: 'ok' },
    };
    ws.send(JSON.stringify(result));
  });

  ws.on('close', () => {
    console.log('Worker disconnected');
  });
});