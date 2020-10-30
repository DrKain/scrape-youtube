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
    return ownerBadges ? ownerBadges.map(function (badge) { return badge['metadataBadgeRenderer']; }) : [];
};
/**
 * Attempt to find out if the channel is verified
 * @param video Video Renderer
 */
var isVerified = function (video) {
    var badges = getChannelBadges(video);
    return (badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST') ||
        badges.includes('BADGE_STYLE_TYPE_VERIFIED'));
};
/**
 * Attempt to fetch channel link
 * @param channel Channel Renderer
 */
var getChannelLink = function (channel) {
    return 'https://www.youtube.com' + (channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
        channel.navigationEndpoint.commandMetadata.webCommandMetadata.url);
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
    return video.publishedTimeText ? video.publishedTimeText.simpleText : '';
};
var getViews = function (video) {
    return +(video.viewCountText.simpleText.replace(/[^0-9]/g, ''));
};
/**
 * Attempt to fetch the channel thumbnail
 * @param video Channel Renderer
 */
var getChannelThumbnail = function (video) {
    return video.channelThumbnailSupportedRenderers
        .channelThumbnailWithLinkRenderer
        .thumbnail
        .thumbnails[0].url;
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
    return (playlist ? 'https://www.youtube.com/playlist?list=' : 'https://youtu.be/') + id;
};
/**
 * Fetch basic information about the channel
 * @param video Video Renderer
 */
exports.getChannelData = function (video) {
    var channel = video.ownerText.runs[0];
    return {
        name: channel.text,
        link: getChannelLink(channel),
        verified: isVerified(video),
        thumbnail: getChannelThumbnail(video)
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
        description: compress(result.descriptionSnippet),
        thumbnail: getVideoThumbnail(result.videoId),
        channel: exports.getChannelData(result)
    };
};
/**
 * Extract all information required for the "Video" result type
 * @param result Video Renderer
 */
exports.getVideoData = function (result) {
    return __assign(__assign({}, getResultData(result)), { views: getViews(result), uploaded: getUploadDate(result), duration: parseDuration(result.lengthText.simpleText) });
};
// TODO: These ↓
// const getPlaylistData = (result: any): Playlist => { };
// const getSteamData = (result: any): LiveSteam => { };
// const getMovieData = (result: any): Movie => { };
