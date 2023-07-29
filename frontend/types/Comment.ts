export type CommentItem = {
    id: number;
    body: string;
    date: Date;
    user: {
        name: string
    }
}

export type ApiGetCommentsOfVideo = {
    comments: CommentItem[];
    commentsCount: number;
    userCommented: boolean;
}