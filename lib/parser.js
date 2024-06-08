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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Attempt to find out if the channel is verified
 * @param videoRenderer Video Renderer
 */
var isVerified = function (badgesRaw) {
    var _a;
    var badges = (_a = badgesRaw === null || badgesRaw === void 0 ? void 0 : badgesRaw.map(function (badge) { return badge.metadataBadgeRenderer.style; })) !== null && _a !== void 0 ? _a : [];
    return badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST') || badges.includes('BADGE_STYLE_TYPE_VERIFIED');
};
/**
 * Attempt to fetch channel link
 * @param id Channel ID
 * @param handle Channel Handle
 */
var getChannelLink = function (id, handle) {
    return handle ? 'https://www.youtube.com/' + handle : 'https://www.youtube.com/channel/' + id;
};
/**
 * Compresses the "runs" texts into a single string.
 * @param key Video Renderer key
 */
var compress = function (key) {
    return (key && key['runs'] ? key['runs'].map(function (v) { return v.text; }) : []).join('');
};
/**
 * Parse an hh:mm:ss timestamp into total seconds
 * @param text hh:mm:ss
 */
var parseDuration = function (text) {
    if (!text)
        return undefined;
    var nums = text.split(':');
    var sum = 0;
    var multi = 1;
    while (nums.length > 0) {
        sum += multi * parseInt(nums.pop() || '-1', 10);
        multi *= 60;
    }
    return sum;
};
/**
 * Sometimes the upload date is not available. YouTube is to blame, not this package.
 * @param videoRenderer Video Renderer
 */
var getUploadDate = function (uploadText) {
    if (!uploadText)
        return undefined;
    return uploadText.replace('Streamed', '').trim();
};
/**
 * Fetch the number of users watching a live stream
 * @param videoRenderer Video Renderer
 */
var getWatchers = function (videoRenderer) {
    try {
        return +videoRenderer.viewCountText.runs[0].text.replace(/[^0-9]/g, '');
    }
    catch (e) {
        return 0;
    }
};
/**
 * Some paid movies do not have views
 * @param videoRenderer Video Renderer
 */
var getViews = function (videoRenderer) {
    try {
        return +videoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, '');
    }
    catch (e) {
        return 0;
    }
};
/**
 * Get the video count from the channel renderer
 * @param channel Channel Renderer
 */
var getVideoCount = function (channel) {
    try {
        return +channel.videoCountText.runs[0].text.replace(/[^0-9]/g, '');
    }
    catch (e) {
        return 0;
    }
};
/**
 * Attempt to get the subscriber count.
 * This can end up being a string like 50k
 * @param channel Channel Renderer
 */
var getSubscriberCount = function (channel) {
    try {
        // YouTube started using the channel handle in "subscriberCountText"
        // Really not sure what the logic was there.
        var samples = [channel.subscriberCountText.simpleText, channel.videoCountText.simpleText];
        for (var _i = 0, samples_1 = samples; _i < samples_1.length; _i++) {
            var item = samples_1[_i];
            if (item.includes('subscribers')) {
                return item.split(' ').shift();
            }
        }
        return '0';
    }
    catch (e) {
        return '0';
    }
};
/**
 * Convert subscriber count to number
 * @param channel Channel Renderer
 * @returns number
 */
var convertSubs = function (channel) {
    try {
        var count = getSubscriberCount(channel);
        // If there's no K, M or B at the end.
        if (!isNaN(+count))
            return +count;
        var char = count.slice(-1);
        var slicedCount = Number(count.slice(0, -1));
        switch (char.toLowerCase()) {
            case 'k':
                slicedCount *= 1000;
                break;
            case 'm':
                slicedCount *= 1e6;
                break;
            case 'b':
                slicedCount *= 1e9;
                break;
        }
        return ~~slicedCount;
    }
    catch (error) {
        return 0;
    }
};
/**
 * Attempt to fetch the channel thumbnail
 * @param videoRenderer video Renderer
 */
var getChannelThumbnail = function (channelThumbnailWithLinkRenderer) {
    var _a, _b;
    var url = (_b = (_a = channelThumbnailWithLinkRenderer === null || channelThumbnailWithLinkRenderer === void 0 ? void 0 : channelThumbnailWithLinkRenderer.thumbnail) === null || _a === void 0 ? void 0 : _a.thumbnails) === null || _b === void 0 ? void 0 : _b[0].url;
    var urlElement = url === null || url === void 0 ? void 0 : url.split('=').shift();
    return urlElement ? urlElement + '=s0?imgmax=0' : "https://www.gstatic.com/youtube/img/originals/promo/ytr-logo-for-search_160x160.png";
};
var getVideoThumbnail = function (id) {
    // This doesn't always work, unfortunately
    // return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
};
/**
 * Fetch a video or playlist link using the supplied ID
 * @param id ID
 * @param playlist is playlist true/false
 */
var getLink = function (id, playlist) {
    if (playlist === void 0) { playlist = false; }
    return (playlist ? 'https://www.youtube.com/playlist?list=' : 'https://youtu.be/') + id;
};
var getBiggestThumbnail = function (thumbnails) {
    return 'https:' + thumbnails.shift().url.split('=').shift() + '=s0?imgmax=0';
};
/**
 * Extract channel render data from the search results
 * @param channel Channel Renderer
 */
exports.getChannelRenderData = function (channel) {
    var id = channel.channelId;
    var handle = exports.getChannelHandle(channel);
    return {
        id: id,
        name: channel.title.simpleText,
        link: getChannelLink(id, handle),
        handle: handle,
        verified: isVerified(channel),
        thumbnail: getBiggestThumbnail(channel.thumbnail.thumbnails),
        description: compress(channel.descriptionSnippet),
        videoCount: getVideoCount(channel),
        subscribers: getSubscriberCount(channel),
        subscriberCount: convertSubs(channel)
    };
};
/**
 * Attempt to resolve the channel's handle. Returns null if no custom handle is found.
 * @param channel Channel Renderer
 * @returns handle or null
 */
exports.getChannelHandle = function (channel) {
    var url = channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl;
    return url.startsWith('/@') ? url.slice(1) : null;
};
/**
 * Fetch basic information about the channel
 * @param videoRenderer Video Renderer
 */
exports.getChannelData = function (videoRenderer) {
    var _a;
    var channel = (videoRenderer.ownerText || videoRenderer.longBylineText)['runs'][0];
    var handle = exports.getChannelHandle(channel);
    var id = channel.navigationEndpoint.browseEndpoint.browseId;
    return {
        id: id,
        name: channel.text,
        link: getChannelLink(id, handle),
        handle: handle,
        verified: isVerified(videoRenderer.ownerBadges),
        thumbnail: getChannelThumbnail((_a = videoRenderer.channelThumbnailSupportedRenderers) === null || _a === void 0 ? void 0 : _a.channelThumbnailWithLinkRenderer)
    };
};
/**
 * Get the playlist thumbnail (the first video in the list)
 * @param result Playlist Renderer
 */
var getPlaylistThumbnail = function (result) {
    return getVideoThumbnail(result.navigationEndpoint.watchEndpoint.videoId);
};
/**
 * Similar to getResultData, but with minor changes for playlists
 * @param result Playlist Renderer
 */
var getPlaylistResultData = function (result) {
    var id = result.playlistId;
    return {
        id: id,
        title: result.title.simpleText,
        link: getLink(id, true),
        thumbnail: getPlaylistThumbnail(result),
        channel: exports.getChannelData(result)
    };
};
/**
 * Fetch the default result data included in all result types
 * @param videoRenderer Video Renderer
 */
var getResultData = function (videoRenderer) {
    return {
        id: videoRenderer.videoId,
        title: compress(videoRenderer.title),
        link: getLink(videoRenderer.videoId, false),
        thumbnail: getVideoThumbnail(videoRenderer.videoId),
        channel: exports.getChannelData(videoRenderer)
    };
};
/**
 * Extract information about a video in a playlist
 * @param child Child Renderer
 */
var getPlaylistVideo = function (child) {
    var _a;
    return {
        id: child.videoId,
        title: child.title.simpleText,
        link: getLink(child.videoId),
        duration: (_a = parseDuration(child.lengthText.simpleText)) !== null && _a !== void 0 ? _a : 0,
        durationString: child.lengthText.simpleText,
        thumbnail: getVideoThumbnail(child.videoId)
    };
};
var getVideoDescription = function (videoRenderer) {
    try {
        return compress(videoRenderer.detailedMetadataSnippets[0]['snippetText']) || videoRenderer.descriptionSnippet || '';
    }
    catch (error) {
        return '';
    }
};
/**
 * Extract all information required for the "Video" result type
 * @param videoRenderer Video Renderer
 */
exports.getVideoData = function (videoRenderer) {
    var _a, _b, _c;
    return __assign(__assign({}, getResultData(videoRenderer)), { description: getVideoDescription(videoRenderer), views: getViews(videoRenderer), uploaded: getUploadDate((_a = videoRenderer.publishedTimeText) === null || _a === void 0 ? void 0 : _a.simpleText), duration: (_c = parseDuration((_b = videoRenderer.lengthText) === null || _b === void 0 ? void 0 : _b.simpleText)) !== null && _c !== void 0 ? _c : 0, durationString: videoRenderer.lengthText ? videoRenderer.lengthText.simpleText : '0' });
};
/**
 * Extract all playlist information from the renderer
 * @param result Playlist Renderer
 */
exports.getPlaylistData = function (result) {
    var cvideos = [];
    // Loop through any visible child videos and extract the data
    result.videos.map(function (video) {
        try {
            cvideos.push(getPlaylistVideo(video['childVideoRenderer']));
        }
        catch (e) { }
    });
    return __assign(__assign({}, getPlaylistResultData(result)), { videoCount: +result['videoCount'], videos: cvideos });
};
/**
 *
 * @param videoRenderer  VideoRenderer
 * @returns LiveStream
 */
exports.getStreamData = function (videoRenderer) {
    return __assign(__assign({}, getResultData(videoRenderer)), { watching: getWatchers(videoRenderer) });
};
//# sourceMappingURL=parser.js.map