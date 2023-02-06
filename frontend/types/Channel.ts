export type ChannelItem = {
    id: number;
    avatar: string;
    name: string;
    verified: boolean;
}

export type Channel = {
    id: number;
    banner: string;
    avatar: string;
    name: string;
    description: string | null;
    verified: boolean;
    count_views: number;
    count_videos: number;
    subscribers: number;
    user_subscribed: boolean;
    created_at: Date;
}

export type ApiGetMySubscriptions = {
    data: ChannelItem[]
}

export type ApiGetOneChannel = {
    data: Channel
}