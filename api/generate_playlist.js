import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    const jsonPath = path.join(process.cwd(), 'channels.json');
    const jsonData = await readFile(jsonPath, 'utf-8');
    const channels = JSON.parse(jsonData);

    const providerName = 'IPTV07INDIA';

    // Header line
    let m3uPlaylist = "#EXTM3U xjoin TG @IPTV07INDIA\n\n";

    channels.forEach(channel => {
        const name = channel.channel_name || 'Unknown';
        const logo = channel.channel_logo || '';
        const genre = channel.channel_genre || 'General';
        const group = `${providerName} | ${genre}`;
        const channelId = channel.channel_id;

        // Embed headers in the stream URL
        const url = `https://special-by07.vercel.app//api/stream?channel=${channelId}`;

        m3uPlaylist += `#EXTINF:-1 tvg-id="${channelId}" tvg-name="${name}" tvg-logo="${logo}" group-title="${group}", ${name}\n`;
        m3uPlaylist += `${url}\n\n`;
    });

    res.setHeader('Content-Type', 'text/plain');
    res.send(m3uPlaylist);
}
