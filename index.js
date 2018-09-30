var jsdom = require('jsdom');

var url = "https://www.youtube.com/results?";
var filter = {
    any : "CAA%253D",
    video : "EgIQAQ%253D%253D",
    channel : "EgIQAg%253D%253D",
    playlist : "EgIQAw%253D%253D",
    movie : "EgIQBA%253D%253D",
    show : "EgIQBQ%253D%253D"
};

function parse(url, options){

    return new Promise(function(resolve, reject){

        jsdom.JSDOM.fromURL(url, {
            resources : 'usable'
        }).then(function(dom){
            var $ = require('jquery')(dom.window);
            var results = [];

            function aspl(s){
                var spl = s.split(':');
                if(spl.length === 0) return +spl;
                else {
                    var sum = +spl.pop();
                    if(spl.length === 1)
                        sum += +spl[0] * 60;
                    if(spl.length === 2){
                        sum += +spl[1] * 60;
                        sum += +spl[0] * 3600;
                    }
                    return sum;
                }
            }

            var first = false;

            $(".yt-lockup").each(function(i, v){
                var $video = $(v);

                var type = $video.find('.accessible-description').text();
                type = type.indexOf(" - Channel") > -1 ? "channel" : type;
                type = type.indexOf(" - Duration:") > -1 ? "video" : type;
                type = type.indexOf(" - Playlist") > -1 ? "playlist" : type;

                var upload_date = null;
                var views = null;
                var video_count = null;

                if(type === "video"){
                    upload_date = $video.find('.yt-lockup-meta-info li:first-of-type').text();
                    views = +$video.find('.yt-lockup-meta-info li:last-of-type').text().replace(/[^0-9.]/g, '');
                }

                if(type === "playlist"){
                    video_count = +$video.find(".formatted-video-count-label b").text();
                }

                var result = {
                    type            : type,

                    channel         : $video.find(".yt-lockup-byline a").text() || null,
                    channel_link    : "https://youtube.com" + $video.find(".yt-lockup-byline a").attr('href') || null,

                    title           : $video.find(".yt-lockup-title a").text(),
                    duration        : aspl($video.find(".video-time").text().trim()) || null,
                    thumbnail       : $video.find('.yt-thumb-simple img').attr('data-thumb') || $video.find('.yt-thumb-simple img').attr('src'),
                    upload_date     : upload_date,
                    views           : views,
                    video_count     : video_count,
                    description     : $video.find('.yt-lockup-description').text() || null,
                    link            : "https://youtube.com" + $video.find('a.yt-uix-tile-link').attr('href')
                };

                if(options.null_values === false){
                    Object.keys(result).forEach(function(i){
                        if(result[i] === null) delete result[i];
                    })
                }

                if(i < options.limit) results.push(result);
            });

            resolve(results);
        }, reject);
    });
}

module.exports = function(query, options){
    return new Promise(function(resolve, reject){
        if(typeof options === "undefined") options = {};

        options = Object.assign({
            type : 'video',
            null_values : false,
            limit : 20
        }, options);

        if(query.trim().length === 0) return reject(new Error("Search cannot be blank"));
        if(options.type && filter[options.type]) url += "sp=" + filter[options.type] + "&";

        resolve(parse(url + "search_query=" + query.replace(/\s/g, '+'), options || {}));

    });
};