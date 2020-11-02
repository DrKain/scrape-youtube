"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var parser_1 = require("./parser");
var https_1 = require("https");
var Youtube = /** @class */ (function () {
    function Youtube() {
        this.debug = false;
    }
    Youtube.prototype.getURL = function (query, options) {
        var url = new URL('/results', 'https://www.youtube.com');
        url.search = new URLSearchParams({ search_query: query }).toString();
        return url.href + '&sp=' + interface_1.ResultFilter[(options.type || 'video')];
    };
    Youtube.prototype.extractRenderData = function (page) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                // Last update they actually commented it as scraper data.
                var data = page.split('// scraper_data_begin')[1].trim()
                    .split('// scraper_data_end')[0].trim()
                    .slice(0, -1)
                    .slice('var ytInitialData = '.length);
                resolve(JSON.parse(data).contents
                    .twoColumnSearchResultsRenderer
                    .primaryContents
                    .sectionListRenderer
                    .contents[0]
                    .itemSectionRenderer
                    .contents);
            }
            catch (e) {
                if (_this.debug)
                    console.log(e);
                reject('Failed to extract video data. The request may have been blocked');
            }
        });
    };
    /**
     * Parse the data extracted from the page to match each interface
     * @param data Video Renderer Data
     */
    Youtube.prototype.parseData = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var results_1 = {
                    videos: [],
                    playlists: [],
                    streams: []
                };
                data.forEach(function (item) {
                    if (item['videoRenderer'] && item['videoRenderer']['lengthText']) {
                        try {
                            var result = parser_1.getVideoData(item['videoRenderer']);
                            results_1.videos.push(result);
                        }
                        catch (e) {
                            if (_this.debug)
                                console.log(e);
                        }
                    }
                    if (item['videoRenderer'] && !item['videoRenderer']['lengthText']) {
                        try {
                            var result = parser_1.getStreamData(item['videoRenderer']);
                            results_1.streams.push(result);
                        }
                        catch (e) {
                            if (_this.debug)
                                console.log(e);
                        }
                    }
                    if (item['playlistRenderer']) {
                        try {
                            var result = parser_1.getPlaylistData(item['playlistRenderer']);
                            results_1.playlists.push(result);
                        }
                        catch (e) {
                            if (_this.debug)
                                console.log(e);
                        }
                    }
                });
                resolve(results_1);
            }
            catch (e) {
                console.warn(e);
                reject('Fatal error when parsing result data. Please report this on GitHub');
            }
        });
    };
    /**
     * Load the page and scrape the data
     * @param query Search query
     * @param options Search options
     */
    Youtube.prototype.load = function (query, options) {
        var url = this.getURL(query, options);
        if (this.debug)
            console.log(url);
        return new Promise(function (resolve, reject) {
            https_1.get(url, function (res) {
                res.setEncoding('utf8');
                var data = '';
                res.on('data', function (chunk) { return data += chunk; });
                res.on('end', function () { return resolve(data); });
            }).on('error', reject);
        });
    };
    Youtube.prototype.search = function (query, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var page, data, results, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.load(query, options || {})];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, this.extractRenderData(page)];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, this.parseData(data)];
                    case 3:
                        results = _a.sent();
                        resolve(results);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    return Youtube;
}());
var youtube = new Youtube();
exports.default = youtube;
