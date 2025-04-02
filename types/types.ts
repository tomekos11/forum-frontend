export interface Topic {
    id: number,
    forumId: number,
    name: string,
    isPrimary: 0,
    createdAt: string, 
    updatedAt: string;
    postCounter: null 
}

export interface LatestPost {
    id: number;
    userId: number;
    topicId: number;
    title: string;
    content: string;
    createdAt: string, 
    updatedAt: string;
}

export interface Forum {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    topics: Topic[]
    latestPost: LatestPost;
}