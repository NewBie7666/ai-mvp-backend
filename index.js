// 最简 Node.js 后端，支持 HTTP 接收任务 + WebSocket Worker 通信
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// HTTP 接口示例
app.post('/task', (req, res) => {
    console.log('Received HTTP task:', req.body);
    res.json({ status: 'ok' });
});

// 绑定 0.0.0.0，让外部 Worker 可以连接
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`);
});

// WebSocket Server，用于 Worker Tunnel
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Worker connected');

    ws.on('message', (msg) => {
        console.log('Worker message:', msg.toString());
        // 模拟处理任务并返回
        let data;
        try {
            data = JSON.parse(msg.toString());
        } catch (e) {
            data = { type: 'unknown', raw: msg.toString() };
        }
        const result = {
            type: 'job_result',
            job_id: data.job_id || 'test',
            result: { message: 'ok' }
        };
        ws.send(JSON.stringify(result));
    });

    ws.on('close', () => {
        console.log('Worker disconnected');
    });
});