const youtube = require('../index'); // require('scrape-youtube');
const search = youtube.search;

search('Upside down and inside out', {
    limit : 5,
    type : 'video'
}).then(console.log, console.log);