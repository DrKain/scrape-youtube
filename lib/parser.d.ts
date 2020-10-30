import { Channel, Video } from './interface';
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
