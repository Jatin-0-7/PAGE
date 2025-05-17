import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    const { channel } = req.query;

    // JSON फाईल वाचा
    const jsonPath = path.join(process.cwd(), 'channels.json');
    const jsonData = await readFile(jsonPath, 'utf-8');
    const channels = JSON.parse(jsonData);

    // चॅनल शोधा
    const channelData = channels.find(ch => ch.channel_id === channel);

    if (!channelData) {
        return res.status(404).json({ error: "Channel not found" });
    }

    // Original URL फेच करा
    const originalUrl = channelData.channel_url;

    // Original URL वर redirect करा
    res.redirect(originalUrl);
}
