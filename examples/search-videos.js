var search = require('../index'); // require('scrape-youtube');

search("Upside down and inside out", {
    limit : 5,
    type : "video"
}, function(err, results){
    console.log(JSON.stringify(results, null, 2));
});