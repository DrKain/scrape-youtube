var jsdom = require('jsdom');

function parse(url, callback){

    jsdom.JSDOM.fromURL(url, {
        resources : 'usable'
    }).then(function(dom){
        var $ = require('jquery')(dom.window);
        var results = [];

        $(dom.window).ready(function(){

            $(".yt-lockup").each(function(i, v){
                var $video = $(v);

                var result = {
                    title           : $video.find(".yt-lockup-title a").text(),
                    duration        : $video.find(".video-time").text().trim(),
                    thumbnail       : $video.find('.yt-thumb-simple img').attr('data-thumb') || $video.find('.yt-thumb-simple img').attr('src'),
                    upload_date     : $video.find('.yt-lockup-meta-info li:first-of-type').text(),
                    views           : $video.find('.yt-lockup-meta-info li:last-of-type').text(),
                    description     : $video.find('.yt-lockup-description').text(),
                    link            : "https://youtube.com" + $video.find('a.yt-uix-tile-link').attr('href')
                };

                results.push(result);
            });

            return callback(null, results);

        });
    });
}

module.exports = function(query, callback){
    if(query.trim().length === 0) return callback(new Error("Search cannot be blank"), null);
    query = query.replace(/\s/g, '+');
    // sp=EgIQAQ%253D%253D = filter videos only
    parse("https://www.youtube.com/results?sp=EgIQAQ%253D%253D&search_query=" + query, callback);
};