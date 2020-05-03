"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var cheerio = require("cheerio");
var ResultType;
(function (ResultType) {
    ResultType["any"] = "any";
    ResultType["video"] = "video";
    ResultType["channel"] = "channel";
    ResultType["playlist"] = "playlist";
    ResultType["movie"] = "movie";
    ResultType["live"] = "live";
})(ResultType = exports.ResultType || (exports.ResultType = {}));
var ResultFilter = (_a = {},
    _a[ResultType.any] = 'CAA%253D',
    _a[ResultType.video] = 'EgIQAQ%253D%253D',
    _a[ResultType.channel] = 'EgIQAg%253D%253D',
    _a[ResultType.playlist] = 'EgIQAw%253D%253D',
    _a[ResultType.movie] = 'EgIQBA%253D%253D',
    _a[ResultType.live] = 'EgJAAQ%253D%253D',
    _a);
var Youtube = /** @class */ (function () {
    function Youtube() {
        this.host = 'https://www.youtube.com';
    }
    /**
     * Generates a request URL using the search options provided.
     * @param params SearchOptions
     */
    Youtube.prototype.getRequestURL = function (params) {
        return (this.host + "/results" +
            this.querystring({
                search_query: encodeURIComponent(params.query),
                page: params.page,
                sp: ResultFilter[params.type]
            }));
    };
    /**
     * Converts an object into a browser query string.
     * { one: 'two' } becomes ?one=two
     * @param o Object
     */
    Youtube.prototype.querystring = function (o) {
        return Object.keys(o).map(function (v, i) {
            return (i !== 0 ? '&' : '?') + (v + "=" + o[v]);
        }).join('');
    };
    /**
     * Extracts the youtube thumbnail and removes the unnecessary parameters
     * @param $result Cheerio Element
     */
    Youtube.prototype.getThumbnail = function ($result) {
        var $img = $result.find('.yt-thumb-simple img');
        return ($img.attr('data-thumb') ||
            $img.attr('src')).split('?sqp=').shift();
    };
    /**
     * Fetches the channel information (link, name and verified status)
     * @param $result Cheerio Element
     */
    Youtube.prototype.getChannelData = function ($result) {
        var $verified = $result.find('span.yt-channel-title-icon-verified');
        var $channel = $result.find('.yt-lockup-byline a');
        var data = {
            name: $channel.text(),
            link: "https://youtube.com" + $channel.attr('href'),
            verified: $verified && $verified.attr('title') === 'Verified'
        };
        // This will need a more reliable workaround
        if ($channel.length === 0) {
            data.name = 'Youtube Movies';
            data.link = 'https://www.youtube.com/channel/UClgRkhTL3_hImCAmdLfDE4g';
            data.verified = true;
        }
        return data;
    };
    /**
     * Attempts to find the result type based on the badges
     * and description
     * @param $result Cheerio Element
     */
    Youtube.prototype.getType = function ($result) {
        var type = ResultType.any;
        var $liveBadge = $result.find('.yt-badge-live');
        var $desc = $result.find('.accessible-description')
            .text().split(':').shift();
        if ($liveBadge.length) {
            type = ResultType.live;
        }
        else {
            switch ($desc) {
                case ' - Duration':
                    type = ResultType.video;
                    break;
                case ' - Movie - Duration':
                    type = ResultType.movie;
                    break;
                case ' - Channel':
                    type = ResultType.channel;
                    break;
                case ' - Playlist':
                    type = ResultType.playlist;
                    break;
            }
        }
        return type;
    };
    /**
     * Extract the title data and ID.
     * Fetches playlist ID for playlists and youtube ID for everything else.
     * @param $result Cheerio Element
     * @param type ResultType
     */
    Youtube.prototype.getTitleData = function ($result, type) {
        var $title = $result.find('.yt-lockup-title a');
        var $link = $title.attr('href');
        var id = (type === ResultType.playlist ?
            $link.split('list=').pop() :
            $link.split('?v=').pop());
        return {
            text: $title.text(),
            id: id,
            link: "https://www.youtube.com" + $link
        };
    };
    /**
     * Fetch the duration (in seconds) from the video type (hh:mm:ss)
     * @param $result Cheerio Element
     */
    Youtube.prototype.getDuration = function ($result, type) {
        var $time = $result.find('.video-time').text().trim();
        var duration = -1;
        if (type === ResultType.movie) {
            $time = $result.find('.accessible-description').text().trim();
            if ($time.length)
                $time = $time.split('Duration:').pop();
        }
        if ($time.length) {
            var spl = $time.split(':');
            if (spl.length === 0)
                duration = +spl;
            else {
                duration = +spl.pop();
                if (spl.length === 1)
                    duration += +spl[0] * 60;
                if (spl.length === 2) {
                    duration += +spl[1] * 60;
                    duration += +spl[0] * 3600;
                }
            }
        }
        return duration;
    };
    /**
     * Fetch the number of people watching a live stream
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    Youtube.prototype.getWatchers = function ($result, $) {
        var $items = $result.find('.yt-lockup-meta-info li');
        var users = 0;
        $items.each(function (index, item) {
            var $item = $(item);
            if ($item.text().includes('watching')) {
                users = +$item.text().replace(/[^0-9.]/g, '');
            }
        });
        return users;
    };
    /**
     * Get the number of views a video has
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    Youtube.prototype.getViews = function ($result, $) {
        var views = -1;
        var $items = $result.find('.yt-lockup-meta-info li');
        $items.each(function (index, item) {
            var $item = $(item);
            if ($item.text().includes('views')) {
                views = +$item.text().replace(/[^0-9.]/g, '');
            }
        });
        return views;
    };
    /**
     * Get the date a video was uploaded
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    Youtube.prototype.getResultTimestamp = function ($result, $) {
        var $items = $result.find('.yt-lockup-meta-info li');
        var time = 'unknown';
        $items.each(function (index, item) {
            var $item = $(item);
            if ($item.text().includes('ago')) {
                time = $item.text();
            }
        });
        return time;
    };
    /**
     * Load a url and begin scraping the data.
     * @param url Youtube URL
     * @param params SearchOptions
     */
    Youtube.prototype.load = function (url, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request({ method: 'GET', url: url }, function (err, res, body) {
                if (err)
                    return reject(err);
                var results = [];
                var $ = cheerio.load(body);
                $('.yt-lockup').each(function (index, item) {
                    var $result = $(item);
                    var type = _this.getType($result);
                    var title = _this.getTitleData($result, type);
                    // Populate default data
                    var data = {
                        type: type,
                        channel: _this.getChannelData($result),
                        id: title.id,
                        title: title.text,
                        link: title.link,
                        description: $result.find('.yt-lockup-description').text(),
                        thumbnail: _this.getThumbnail($result)
                    };
                    // Add data for live streams
                    if (type === ResultType.live) {
                        data.watching = _this.getWatchers($result, $);
                    }
                    // Add data for anything that's not a playlist or live stream
                    if ([ResultType.playlist, ResultType.live].indexOf(type) === -1) {
                        data.duration = _this.getDuration($result, type);
                        // Exclude views and uploaded for movies
                        if (type !== ResultType.movie) {
                            data.views = _this.getViews($result, $);
                            data.uploaded = _this.getResultTimestamp($result, $);
                        }
                    }
                    // Add data for playlists
                    if (type === ResultType.playlist) {
                        data.videoCount = +$result.find('.formatted-video-count-label b').text();
                    }
                    if (index < params.limit) {
                        // Skip random google ads that get scraped accidentally
                        // I need a sample of the response to filter this correctly
                        if (!data.link.includes('www.googleadservices.com')) {
                            results.push(data);
                        }
                    }
                });
                resolve(results);
            });
        });
    };
    /**
     * Search youtube for results.
     * Result type defaults to 'video'. See advanced use for more information
     * @param query Search Query
     * @param options Search Options
     */
    Youtube.prototype.search = function (query, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var params = __assign({ query: query.trim(), page: 0, type: ResultType.video, limit: 10 }, options);
            if (params.query.length === 0) {
                return reject(new Error('Search cannot be blank'));
            }
            if (!Object.keys(ResultType).includes(params.type)) {
                return reject(new Error("Unexpected result type: " + params.type));
            }
            if (params.page < 0) {
                return reject(new Error("Page number can not be lower than 0"));
            }
            if (params.limit <= 0) {
                return reject(new Error('Limit can not be lower than 1'));
            }
            var url = _this.getRequestURL(params);
            _this.load(url, params).then(resolve).catch(reject);
        });
    };
    /**
     * Lazy shortcut to get the first result. Probably useful with discord bots.
     * @param query Search String
     */
    Youtube.prototype.searchOne = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.search(query, { type: ResultType.video, limit: 1 }).then(function (results) {
                resolve(results.length ? results[0] : null);
            }).catch(reject);
        });
    };
    return Youtube;
}());
exports.Youtube = Youtube;
/* For quick use without creating a new instance */
var youtube = new Youtube();
exports.default = youtube;
