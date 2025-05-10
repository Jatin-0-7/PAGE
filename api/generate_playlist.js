import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    // JSON फाईल वाचा
    const jsonPath = path.join(process.cwd(), 'channels.json');
    const jsonData = await readFile(jsonPath, 'utf-8');
    const channels = JSON.parse(jsonData);

    // PROVIDER आणि USER-AGENT नाव सेट करा
    const providerName = 'IPTV07INDIA';
    const userAgent = 'IPTV07INDIA';

    // M3U Header तयार करा
    let m3uPlaylist = "#EXTM3U x-tvg-url="https://avkb.short.gy/epg.xml.gz" billed-till="UNKNOWN" billed-msg="Join @JIPTV07INDIA on Telegram"\n\n";

    // प्रत्येक चॅनेलसाठी Vercel URL तयार करा
    channels.forEach(channel => {
        const name = channel.channel_name || 'Unknown';
        const logo = channel.channel_logo || '';
        const groupLogo = channel.group_logo || ''; // Added group-logo
        const originalGroup = channel.channel_genre || 'General';
        const group = `${providerName} | ${originalGroup}`;
        const url = `https://oppu-restream.pages.dev/api/stream?channel=${channel.channel_id}`;

        // Include group-logo in the M3U entry
        m3uPlaylist += `#EXTINF:-1 tvg-id="${channel.channel_id}" tvg-name="${name}" tvg-logo="${logo}" group-title="${group}" group-logo="${groupLogo}", ${name}\n`;
        m3uPlaylist += `#EXTVLCOPT:http-user-agent=${userAgent}\n`; // <-- NEW USER AGENT LINE
        m3uPlaylist += `${url}\n\n`;
    });

    // M3U फाईल रिस्पॉन्स करा
    res.setHeader('Content-Type', 'text/plain');
    res.send(m3uPlaylist);
}