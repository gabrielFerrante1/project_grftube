import { VideoItem } from "./Video"

export type PlaylistItem = VideoItem & { src: string }

export type Playlist = PlaylistItem[]