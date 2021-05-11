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
 * Fetch all badges the channel has
 * @param video Video Renderer
 */
var getChannelBadges = function (video) {
    var ownerBadges = video.ownerBadges;
    return ownerBadges ? ownerBadges.map(function (badge) { return badge['metadataBadgeRenderer']['style']; }) : [];
};
/**
 * Attempt to find out if the channel is verified
 * @param video Video Renderer
 */
var isVerified = function (video) {
    var _a;
    var badges = getChannelBadges(video);
    return (_a = badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST')) !== null && _a !== void 0 ? _a : badges.includes('BADGE_STYLE_TYPE_VERIFIED');
};
/**
 * Attempt to fetch channel link
 * @param channel Channel Renderer
 */
var getChannelLink = function (channel) {
    return ('https://www.youtube.com' +
        (channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
            channel.navigationEndpoint.commandMetadata.webCommandMetadata.url));
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
 * @param video Video Renderer
 */
var getUploadDate = function (video) {
    return (video.publishedTimeText ? video.publishedTimeText.simpleText : '').replace('Streamed', '').trim();
};
/**
 * Fetch the number of users watching a live stream
 * @param result Video Renderer
 */
var getWatchers = function (result) {
    try {
        return +result.viewCountText.runs[0].text.replace(/[^0-9]/g, '');
    }
    catch (e) {
        return 0;
    }
};
/**
 * Some paid movies do not have views
 * @param video Video Renderer
 */
var getViews = function (video) {
    try {
        return +video.viewCountText.simpleText.replace(/[^0-9]/g, '');
    }
    catch (e) {
        return 0;
    }
};
/**
 * Attempt to fetch the channel thumbnail
 * @param video Channel Renderer
 */
var getChannelThumbnail = function (video) {
    try {
        return video.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails[0].url;
    }
    catch (e) {
        // Return a default youtube avatar when the channel thumbnail is not available (in playlists)
        return "https://www.gstatic.com/youtube/img/originals/promo/ytr-logo-for-search_160x160.png";
    }
};
var getVideoThumbnail = function (id) {
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
/**
 * Fetch basic information about the channel
 * @param video Video Renderer
 */
exports.getChannelData = function (video) {
    var channel = (video.ownerText || video.longBylineText)['runs'][0];
    return {
        name: channel.text,
        link: getChannelLink(channel),
        verified: isVerified(video),
        thumbnail: getChannelThumbnail(video)
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
 * @param result Video Renderer
 */
var getResultData = function (result) {
    return {
        id: result.videoId,
        title: compress(result.title),
        link: getLink(result.videoId, false),
        thumbnail: getVideoThumbnail(result.videoId),
        channel: exports.getChannelData(result)
    };
};
/**
 * Extract information about a video in a playlist
 * @param child Child Renderer
 */
var getPlaylistVideo = function (child) {
    return {
        id: child.videoId,
        title: child.title.simpleText,
        link: getLink(child.videoId),
        duration: parseDuration(child.lengthText.simpleText),
        thumbnail: getVideoThumbnail(child.videoId)
    };
};
/**
 * Extract all information required for the "Video" result type
 * @param result Video Renderer
 */
exports.getVideoData = function (result) {
    return __assign(__assign({}, getResultData(result)), { description: compress(result.descriptionSnippet), views: getViews(result), uploaded: getUploadDate(result), duration: result.lengthText ? parseDuration(result.lengthText.simpleText) : 0 });
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
exports.getStreamData = function (result) {
    return __assign(__assign({}, getResultData(result)), { watching: getWatchers(result) });
};
