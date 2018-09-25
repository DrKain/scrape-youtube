var search = require('../index'); // require('scrape-youtube');

search("Poets of the fall - Sleep", function(err, results){
    if(err) console.warn(err);
    else console.log( JSON.stringify(results[0], null, 2) );
});

/* Expected Output

 {
    "title": "Poets of the Fall - Sleep",
    "duration": "9:05",
    "thumbnail": "https://i.ytimg.com/vi/PFDPf1b-qqQ/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBxooXt6z56yu_LbVuE-P6t-s_KEA",
    "upload_date": "9 years ago",
    "views": "65,448 views",
    "description": "Sleep by Poets of the Fall.",
    "link": "https://youtube.com/watch?v=PFDPf1b-qqQ"
 }

 */