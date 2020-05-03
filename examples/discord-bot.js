const youtube = require('scrape-youtube').default;
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('message', async message => {
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
