export type Reaction = 'like' | 'dislike' | null;

export interface ReactionDb {
    id: number;
    postId: number;
    userId: number;
    reactionType: Reaction;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface Stats {
    posts: number;
    repMinus: number;
    repPlus: number;
}

export interface UserData {
    id: number;
    userId: number;
    bio: string | null;
    description: string | null;
    image: string | null;
    stats: Stats | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface User {
    id: number | null;
    username: string | null;
    role: 'user' | 'marketing' | 'moderator' | 'admin' | null;
    data?: UserData | null;
    followedTopics?: Topic[] | null;
    createdAt: string | null;
    updatedAt: string | null;
  }

export interface Post {
    id: number;
    userId: number;
    topicId: number;
    title: string;
    content: string;
    createdAt: string, 
    updatedAt: string;
    reaction?: {
        dislike: number;
        like: number;
    }
    notification: boolean;
    myReaction?: Reaction;
    topic?: Topic;
    user: User;
    isDeleted: boolean;
}

export interface Topic {
    id: number;
    forumId: number;
    name: string;
    slug: string;
    isPrimary: boolean;
    isClosed: boolean;
    isFollowed?: boolean;
    createdAt: string;
    updatedAt: string;
    postCounter: null;
    pinnedPost?: Post;
    posts?: Post[];
    forum?: Forum;
}

export interface Meta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: null | string;
    previousPageUrl: null | string;

}

export interface Forum {
    id: number;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    topics: Topic[]
    latestPost: Post;
    postCounter?: number;
}

export interface Notification {
    count: number;
    forumSlug: string;
    page: number;
    perPage: number;
    topicSlug: string;
    topicName: string;
}