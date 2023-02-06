type VideoChannel = {
    id: number;
    name: string;
    avatar: string;
    verified: boolean
}

export type VideoItem = {
    id: number;
    title: string;
    thumbnail: string;
    minutes: string;
    date: Date;
    channel: VideoChannel;
    minutes_viewed: string;
    views: number;
}


export type VideoUserViewed = {
    minutes: string;
}

export type Video = {
    id: number;
    title: string;
    src: string;
    description: string | null;
    comments_area: boolean;
    thumbnail: string;
    minutes: string;
    date: Date;
    channel: VideoChannel & { subscribers: number };
    user_viewed: VideoUserViewed;
    user_subscribed: boolean;
    user_rate: '' | 'like' | 'dislike';
    views: number;
    likes: number;
    tags: string[]
}

export interface ApiGetVideos {
    data: VideoItem[]
}

export type ApiGetVideoRates = {
    data: VideoItem[]
}
export type ApiGetVideoHistory = {
    data: VideoItem[]
}
export type ApiGetOneVideo = Video