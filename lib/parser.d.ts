import { Channel, ChannelResult, LiveStream, Playlist, Video } from './interface';
/**
 * Extract channel render data from the search results
 * @param channel Channel Renderer
 */
export declare const getChannelRenderData: (channel: any) => ChannelResult;
/**
 * Fetch basic information about the channel
 * @param video Video Renderer
 */
export declare const getChannelData: (video: any) => Channel;
/**
 * Extract all information required for the "Video" result type
 * @param result Video Renderer
 */
export declare const getVideoData: (result: any) => Video;
/**
 * Extract all playlist information from the renderer
 * @param result Playlist Renderer
 */
export declare const getPlaylistData: (result: any) => Playlist;
export declare const getStreamData: (result: any) => LiveStream;
