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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ResultFilter = (_a = {},
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
                sp: exports.ResultFilter[params.type]
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
     * Generate video thumbnail
     * @param id Youtube video ID
     */
    Youtube.prototype.getThumbnail = function (id) {
        return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    };
    /**
     * Convert an hh:mm:ss string into total seconds
     * @param text hh:mm:ss string
     */
    Youtube.prototype.parseDuration = function (text) {
        var duration = -1;
        var spl = text.split(':');
        if (spl.length === 0)
            duration = +spl;
        else {
            duration = +("" + spl.pop());
            if (spl.length === 1)
                duration += +spl[0] * 60;
            if (spl.length === 2) {
                duration += +spl[1] * 60;
                duration += +spl[0] * 3600;
            }
        }
        return duration;
    };
    /**
     * Convert a string into a number.
     * @param s string
     */
    Youtube.prototype.num = function (s) {
        return +("" + s).replace(/[^0-9.]/g, '');
    };
    /**
     * Compresses the "runs" texts into a single string.
     * @param key vRender key
     */
    Youtube.prototype.compress = function (key) {
        return (key && key['runs'] ?
            key['runs'].map(function (v) { return v.text; }) : []).join('');
    };
    /**
     * Fetch channel badges and check if they are verified channels
     * @param vRender vRender
     */
    Youtube.prototype.isChannelVerified = function (vRender) {
        var badges = (vRender['ownerBadges'] ?
            vRender['ownerBadges'].map(function (badge) { return badge['metadataBadgeRenderer']['style']; }) : []);
        return badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST');
    };
    /**
     * Extract channel data from the vRender object
     * @param vRender vRender
     */
    Youtube.prototype.getChannelData = function (vRender) {
        var channel = vRender['ownerText']['runs'][0];
        return {
            name: channel['text'],
            link: ('https://youtube.com' +
                channel['navigationEndpoint']['commandMetadata']['webCommandMetadata']['url']),
            verified: this.isChannelVerified(vRender)
        };
    };
    Youtube.prototype.getDuration = function (vRender) {
        return this.parseDuration(vRender['lengthText']['simpleText']);
    };
    Youtube.prototype.getViews = function (vRender) {
        return this.num(vRender['viewCountText']['simpleText']);
    };
    Youtube.prototype.getUploadedDate = function (vRender) {
        // Sometimes publishedTimeText is not available.
        // EG: https://i.imgur.com/cR1na6k.png
        return vRender['publishedTimeText'] ? vRender['publishedTimeText']['simpleText'] : '';
    };
    /**
     * Load a url and begin scraping the data.
     * @param url Youtube URL
     * @param params SearchOptions
     * @param options request.Options
     */
    Youtube.prototype.load = function (url, params, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request(__assign({ method: 'GET', url: url }, (options || {})), function (err, res, body) { return __awaiter(_this, void 0, void 0, function () {
                var results_1, $, data, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                return [2 /*return*/, reject(err)];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            results_1 = [];
                            $ = cheerio.load(body);
                            return [4 /*yield*/, this.extractInitialData($)];
                        case 2:
                            data = _a.sent();
                            data.forEach(function (item) {
                                try {
                                    var vRender = item['videoRenderer'];
                                    if (vRender) {
                                        var id = vRender['videoId'];
                                        // TODO: Add multiple types again
                                        var result = {
                                            type: ResultType.video,
                                            channel: _this.getChannelData(vRender),
                                            id: id,
                                            title: _this.compress(vRender['title']),
                                            link: "https://www.youtube.com/watch?v=" + id,
                                            description: _this.compress(vRender['descriptionSnippet']),
                                            thumbnail: _this.getThumbnail(id),
                                            views: _this.getViews(vRender),
                                            duration: _this.getDuration(vRender),
                                            uploaded: _this.getUploadedDate(vRender)
                                        };
                                        results_1.push(result);
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            });
                            resolve(results_1);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            reject(e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    Youtube.prototype.extractInitialData = function ($) {
        return new Promise(function (resolve, reject) {
            try {
                var json_1 = null;
                $('script').each(function (i, script) {
                    var html = $(script).html();
                    if (html && html.includes('window["ytInitialData"]')) {
                        var start = (html.split('window["ytInitialData"] = ').pop() || '');
                        var end = start.split('window["ytInitialPlayerResponse"]').shift();
                        if (end) {
                            json_1 = JSON.parse("" + end.replace(/;/g, ''));
                            // Unavoidable Ladder
                            resolve(json_1.contents
                                .twoColumnSearchResultsRenderer
                                .primaryContents
                                .sectionListRenderer
                                .contents[0]
                                .itemSectionRenderer
                                .contents);
                        }
                        else
                            throw Error('Failed to extract InitialData');
                    }
                });
                if (!json_1) {
                    throw Error('Failed to extract InitialData. The request may have been blocked.');
                }
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * Search youtube for results.
     * Result type defaults to 'video'. See advanced use for more information
     * @param query Search Query
     * @param options Search Options
     * @param requestOptions request.Options
     */
    Youtube.prototype.search = function (query, options, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var params = __assign({ query: query.trim(), page: 0, type: ResultType.video, limit: 10 }, options);
            if (params.query.length === 0) {
                return reject(new Error('Search cannot be blank'));
            }
            if (params.type !== ResultType.video) {
                params.type = ResultType.video;
                console.warn('Search type must be `video`. Other types are unsupported in this version but will be re-added in the future');
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
            _this.load(url, params, requestOptions).then(resolve).catch(reject);
        });
    };
    /**
     * Lazy shortcut to get the first result. Probably useful with discord bots.
     * @param query Search String
     * @param options request.Options
     */
    Youtube.prototype.searchOne = function (query, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.search(query, { type: ResultType.video, limit: 1 }, requestOptions).then(function (results) {
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
