export declare enum ResultType {
    any = "any",
    video = "video",
    channel = "channel",
    playlist = "playlist",
    movie = "movie",
    live = "live"
}
export interface SearchOptions {
    type?: ResultType;
    page?: number;
}
export declare const ResultFilter: {
    [key in ResultType]: string;
};
export interface Channel {
    name: string;
    link: string;
    verified: boolean;
    thumbnail: string;
}
export interface Result {
    /** Video or Playlist ID */
    id: string;
    title: string;
    link: string;
    description: string;
    thumbnail: string;
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
}
export interface Playlist extends Result {
    videoCount: number;
    videos: Video[];
}
