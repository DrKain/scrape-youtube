// This file contains all the functions used in extracting information from the video renderer objects
import { Channel, Result, Video } from './interface';

/**
 * Fetch all badges the channel has
 * @param video Video Renderer
 */
const getChannelBadges = (video: any) => {
    const ownerBadges = video.ownerBadges;
    return ownerBadges ? ownerBadges.map((badge: any) => badge['metadataBadgeRenderer']) : [];
};

/**
 * Attempt to find out if the channel is verified
 * @param video Video Renderer
 */
const isVerified = (video: any) => {
    const badges = getChannelBadges(video);
    return (
        badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST') ||
        badges.includes('BADGE_STYLE_TYPE_VERIFIED')
    );
};

/**
 * Attempt to fetch channel link
 * @param channel Channel Renderer
 */
const getChannelLink = (channel: any) => {
    return 'https://www.youtube.com' + (
        channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
        channel.navigationEndpoint.commandMetadata.webCommandMetadata.url
    );
};

/**
 * Compresses the "runs" texts into a single string.
 * @param key Video Renderer key
 */
const compress = (key: any) => {
    return (key && key['runs'] ? key['runs'].map((v: any) => v.text) : []).join('');
};

/**
 * Parse an hh:mm:ss timestamp into total seconds
 * @param text hh:mm:ss
 */
const parseDuration = (text: string): number => {
    const nums = text.split(':');
    let sum = 0;
    let multi = 1;

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
const getUploadDate = (video: any) => {
    return video.publishedTimeText ? video.publishedTimeText.simpleText : '';
};

const getViews = (video: any) => {
    return +(video.viewCountText.simpleText.replace(/[^0-9]/g, ''));
};

/**
 * Attempt to fetch the channel thumbnail
 * @param video Channel Renderer
 */
const getChannelThumbnail = (video: any) => {
    return video.channelThumbnailSupportedRenderers
        .channelThumbnailWithLinkRenderer
        .thumbnail
        .thumbnails[0].url;
};

const getVideoThumbnail = (id: string) => {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
};

/**
 * Fetch a video or playlist link using the supplied ID
 * @param id ID
 * @param playlist is playlist true/false
 */
const getLink = (id: string, playlist: false) => {
    return (playlist ? 'https://www.youtube.com/playlist?list=' : 'https://youtu.be/') + id;
};

/**
 * Fetch basic information about the channel
 * @param video Video Renderer
 */
export const getChannelData = (video: any): Channel => {
    const channel = video.ownerText.runs[0];
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
const getResultData = (result: any): Result => {
    return {
        id: result.videoId,
        title: compress(result.title),
        link: getLink(result.videoId, false),
        description: compress(result.descriptionSnippet),
        thumbnail: getVideoThumbnail(result.videoId),
        channel: getChannelData(result)
    };
};

/**
 * Extract all information required for the "Video" result type
 * @param result Video Renderer
 */
export const getVideoData = (result: any): Video => {
    return {
        ...getResultData(result),
        views: getViews(result),
        uploaded: getUploadDate(result),
        duration: parseDuration(result.lengthText.simpleText)
    };
};

// TODO: These ↓
// const getPlaylistData = (result: any): Playlist => { };
// const getSteamData = (result: any): LiveSteam => { };
// const getMovieData = (result: any): Movie => { };
