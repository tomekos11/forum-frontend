export type Reaction = 'like' | 'dislike' | null;

export interface ReactionDb {
    id: number;
    postId: number;
    userId: number;
    reactionType: Reaction;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface UserData {
    bio: string | null;
    description: string | null;
    image: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface User {
    id: number | null;
    username: string | null;
    role: 'user' | 'marketing' | 'moderator' | 'admin' | null;
    data?: UserData | null;
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
    isPrimary: 0;
    createdAt: string;
    updatedAt: string;
    postCounter: null;
    posts?: Post[];
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