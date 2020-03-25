const jquery = require('jquery');
const jsdom = require('jsdom');

let url = 'https://www.youtube.com/results?';

const jsdConfig = {
    resources: 'usable'
};

const filter = {
    any: 'CAA%253D',
    video: 'EgIQAQ%253D%253D',
    channel: 'EgIQAg%253D%253D',
    playlist: 'EgIQAw%253D%253D',
    movie: 'EgIQBA%253D%253D',
    show: 'EgIQBQ%253D%253D'
};

const getDuration = (s) => {
    const spl = s.split(':');
    if (spl.length === 0) return +spl;
    else {
        let sum = +spl.pop();
        if (spl.length === 1) sum += +spl[0] * 60;
        if (spl.length === 2) {
            sum += +spl[1] * 60;
            sum += +spl[0] * 3600;
        }
        return sum;
    }
};

const parse = (url, options) => {
    return new Promise((resolve, reject) => {
        jsdom.JSDOM.fromURL(url, jsdConfig).then(dom => {
            const $ = jquery(dom.window);
            const results = [];

            $('.yt-lockup').each((i, v) => {
                const $video = $(v);

                let type = $video.find('.accessible-description').text();
                type = type.indexOf(' - Channel') > -1 ? 'channel' : type;
                type = type.indexOf(' - Duration:') > -1 ? 'video' : type;
                type = type.indexOf(' - Playlist') > -1 ? 'playlist' : type;

                let upload_date = null;
                let views = null;
                let video_count = null;

                if (type === 'video') {
                    upload_date = $video.find('.yt-lockup-meta-info li:first-of-type').text();
                    views = +$video.find('.yt-lockup-meta-info li:last-of-type').text().replace(/[^0-9.]/g, '');
                }

                if (type === 'playlist') {
                    video_count = +$video.find('.formatted-video-count-label b').text();
                }

                const result = {
                    type: type,

                    channel: $video.find('.yt-lockup-byline a').text() || null,
                    channel_link: 'https://youtube.com' + $video.find('.yt-lockup-byline a').attr('href') || null,

                    title: $video.find('.yt-lockup-title a').text(),
                    duration: getDuration($video.find('.video-time').text().trim()) || null,
                    thumbnail: $video.find('.yt-thumb-simple img').attr('data-thumb') || $video.find('.yt-thumb-simple img').attr('src'),
                    upload_date: upload_date,
                    views: views,
                    video_count: video_count,
                    description: $video.find('.yt-lockup-description').text() || null,
                    link: 'https://youtube.com' + $video.find('a.yt-uix-tile-link').attr('href'),
                    verified: false
                };

                // No way to discriminate between "verified artist" and "verified channel"
                // Verified artists will appear as a music note on the channel
                // Example: https://www.youtube.com/user/OkGo
                const $sver = $video.find('span.yt-channel-title-icon-verified');
                if ($sver && $sver.attr('title') === 'Verified') {
                    result.verified = true;
                }

                if (options.null_values === false) {
                    Object.keys(result).forEach((i) => {
                        if (result[i] === null) delete result[i];
                    });
                }

                if (i < options.limit) results.push(result);
            });

            resolve(results);
        }, reject);
    });
};

module.exports = {
    /**
     * Search youtube for a list of videos based on a search query.
     * @param query Search Query
     * @param options (optional) Extra search options: type, null_values, limit
     */
    search: (query, options) => {
        return new Promise((resolve, reject) => {
            if (typeof options === 'undefined') options = {};

            options = {
                type: 'video',
                null_values: false,
                limit: 10,
                ...options
            };

            if (query.trim().length === 0) return reject(new Error('Search cannot be blank'));
            if (options.type && filter[options.type]) url += 'sp=' + filter[options.type] + '&';

            resolve(parse(url + 'search_query=' + query.replace(/\s/g, '+'), options || {}));
        });
    }
};