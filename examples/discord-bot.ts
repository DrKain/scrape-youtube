import Discord from 'discord.js';
import { youtube } from 'scrape-youtube';

const client = new Discord.Client();

client.on('message', async (message: Discord.Message) => {
    const prefix = '~';
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = (args.shift() || '').toLowerCase();

    // Use: ~youtube poets of the fall
    if (cmd === 'youtube') {
        const video = await youtube.searchOne(args.join(' '));
        message.channel.send(video ? video.link : 'No Results');
    }
});

client.login('your_discord_token');
