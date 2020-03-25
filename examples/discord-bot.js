const youtube = require('../index'); // require('scrape-youtube');
const Discord = require('discord.js');

const client = new Discord.Client();
const search = youtube.search;

client.on('message', async (message) => {
    const prefix = '~';
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = (args.shift() || '').toLowerCase();
    
    // ~youtube Poets of the Fall - Sleep
    if(cmd === 'youtube') {
        const results = await search(args.join(' '));
        const first = results[0];

        if(first) message.channel.send('Here you go:\n' + first.link);
        else message.channel.send('No results for that query');
    }
});

client.login('your_discord_token');