import { readFile } from 'fs/promises';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export default async function handler(req, res) {
    const { channel } = req.query;

    // Read channels.json
    const jsonPath = path.join(process.cwd(), 'channels.json');
    const jsonData = await readFile(jsonPath, 'utf-8');
    const channels = JSON.parse(jsonData);

    // Find channel
    const channelData = channels.find(ch => ch.channel_id === channel);

    if (!channelData) {
        return res.status(404).json({ error: "Channel not found" });
    }

    const streamUrl = channelData.channel_url;
    const userAgent = channelData.user_agent || 'IPTV07INDIA';

    try {
        const targetUrl = new URL(streamUrl);
        const client = targetUrl.protocol === 'https:' ? https : http;

        const proxyReq = client.request(streamUrl, {
            headers: {
                'User-Agent': userAgent,
                'Referer': channelData.referer || '',
                'Origin': channelData.origin || ''
            }
        }, proxyRes => {
            // Pipe headers and stream
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', err => {
            console.error('Proxy error:', err);
            res.status(500).json({ error: 'Proxy failed' });
        });

        proxyReq.end();

    } catch (err) {
        console.error('Handler error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
