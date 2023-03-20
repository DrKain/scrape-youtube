/// <reference types="node" />
import { RequestOptions } from 'https';
export declare enum ResultType {
    any = "any",
    video = "video",
    channel = "channel",
    playlist = "playlist",
    movie = "movie",
    live = "live"
}
export interface DebugData {
    options?: SearchOptions;
    results?: Results;
    page?: string;
    timestamp?: string;
}
export interface SearchOptions {
    type?: ResultType | string;
    /**
     * Filter override. See README for more information.
     */
    sp?: string;
    /**
     * @deprecated Use `request` instead
     */
    requestOptions?: RequestOptions;
    /**
     * https://nodejs.org/api/http.html#http_http_request_options_callback
     */
    request?: RequestOptions;
    params?: {
        [key: string]: string;
    };
}
export declare const ResultFilter: {
    [key in ResultType]: string;
};
export interface Results {
    videos: Video[];
    playlists: Playlist[];
    streams: LiveStream[];
    channels: ChannelResult[];
}
export interface Channel {
    id: string;
    name: string;
    link: string;
    /**
     * Warning: This is currently unreliable as the API will sometimes use the old channel link.
     * I recommend avoiding this if possible.
     */
    handle: string | null;
    verified: boolean;
    thumbnail: string;
}
export interface ChannelResult extends Channel {
    id: string;
    /**
     * Warning: This is currently unreliable as the API will sometimes use the old channel link.
     * I recommend avoiding this if possible.
     */
    handle: string | null;
    description: string;
    subscribers: string;
    subscriberCount: number;
    videoCount: number;
}
export interface PlaylistVideo {
    /** Playlist ID */
    id: string;
    title: string;
    link: string;
    duration: number;
    durationString: string;
    /** Thumbnail of the first video in the playlist */
    thumbnail: string;
}
export interface Result {
    /** Video ID */
    id: string;
    title: string;
    link: string;
    thumbnail: string;
    /** Information about the uploader */
    channel: Channel;
}
export interface LiveStream extends Result {
    watching: number;
}
export interface Video extends Result {
    views: number;
    /** Sometimes the upload date is not available. YouTube is to blame, not this package. */
    uploaded: string;
    /** Duration in seconds */
    duration: number;
    durationString: string;
    description: string;
}
export interface Playlist extends Result {
    /** Number of videos in the playlist */
    videoCount: number;
    /** This is not a list of all the videos, just the first two displayed in the search results */
    videos: PlaylistVideo[];
}
