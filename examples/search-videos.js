var search = require('../index'); // require('scrape-youtube');

search("Upside down and inside out", {
    limit : 5,
    type : "video"
}).then(function(results){
    console.log(results);
}, function(err){
    console.log(err);
});