scrape-youtube
=============

[![NPM](https://nodei.co/npm/scrape-youtube.png?downloads=true)](https://nodei.co/npm/scrape-youtube/)

**What is this?***
------------------
scrape-youtube is a package for scraping youtube search results, inspired by broken package `youtube-scrape`.
This one uses `jsdom 12.0.0` and the latest version of `jQuery` to retrieve and parse the results.

Install
---------------------

```npm install --save scrape-youtube```

Usage
---------------------

```javascript
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
```

Options / Settings
----------------------

No customizable options or settings yet.

**Additional Notes**
- Please report any issues [here](https://github.com/TryHardHusky/scrape-youtube/issues)