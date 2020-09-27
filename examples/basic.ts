import youtube from 'scrape-youtube';

// Quick search for a single video. Good for discord bots.
youtube.searchOne('Short Change Hero').then(video => console.log(video));

// You can also pass a URL to the searchOne function and ytdl-core will fetch the video information.
youtube.searchOne('https://www.youtube.com/watch?v=xh49HehENPE').then(video => console.log(video));
