import { Channel, ChannelResult, LiveStream, Playlist, Video } from './interface';
import { VideoRenderer, VideoRendererChannelRun } from './interfaces/YoutubeInterfaces';
/**
 * Extract channel render data from the search results
 * @param channel Channel Renderer
 */
export declare const getChannelRenderData: (channel: any) => ChannelResult;
/**
 * Attempt to resolve the channel's handle. Returns null if no custom handle is found.
 * @param channel Channel Renderer
 * @returns handle or null
 */
export declare const getChannelHandle: (channel: VideoRendererChannelRun) => string | null;
/**
 * Fetch basic information about the channel
 * @param videoRenderer Video Renderer
 */
export declare const getChannelData: (videoRenderer: VideoRenderer) => Channel;
/**
 * Extract all information required for the "Video" result type
 * @param videoRenderer Video Renderer
 */
export declare const getVideoData: (videoRenderer: VideoRenderer) => Video;
/**
 * Extract all playlist information from the renderer
 * @param result Playlist Renderer
 */
export declare const getPlaylistData: (result: any) => Playlist;
/**
 *
 * @param videoRenderer  VideoRenderer
 * @returns LiveStream
 */
export declare const getStreamData: (videoRenderer: VideoRenderer) => LiveStream;
