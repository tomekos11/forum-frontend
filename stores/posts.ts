import type { FollowTopicResponse, Meta, Post, Topic } from '~/types/types';


interface Response {
    meta: Meta;
    topic: Topic;
    data: Post[];
  }

export const usePostsStore = defineStore('posts', () => {

  const toast = useToast();
    
  const topic = ref<Topic | null>(null);
  const posts = ref<Post[]>([]);
  const meta = ref<Meta | null>(null);

  const pinnedPost = computed<Post | null>(() => topic.value?.pinnedPost || null);

  const setPosts = (data: Post[]) => {
    posts.value = data;
  };


  const fetchPosts = async (slug: string, params: Record<string, any>) => {
    const { data, meta:m , topic:t } = await useFetchWithAuth<Response>(`/posts/${slug}`, { params });
    posts.value = data || [];
    meta.value = m || null;
    topic.value = t || null;

    return data;
  };

  const togglePostPin = async (post: Post) => {
    const shouldUnpin = pinnedPost.value?.id === post.id;
          
    try {
      const { message, topic: t } = await useFetchWithAuth<{message: string; topic: Topic}>('/posts/pin', {
        body: {
          topicId: post.topicId,
          postId: shouldUnpin ? null : post.id,
        },
        method: 'POST'
      });
          
    
      topic.value = t;
              
      toast.add({
        title: message,
      });
          
    } catch (e) {
      console.error(e);
    }
  };

  const deletePost = async (post: Post) => {
    try {
      const { post: postAfterDelete } = await useFetchWithAuth<{message: string; post: Post}>('/posts', {
        body: {
          postId: post.id
        },
        method: 'delete',
      });
  
      const foundIndex = posts.value.findIndex(post => post.id === postAfterDelete.id);
  
      if(foundIndex !== -1) {
        posts.value[foundIndex] = postAfterDelete;
      }
  
      toast.add({
        title: 'Poprawnie usunięto post',
      });
    
      return true;

    } catch (err) {
      const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';
  
      toast.add({
        title: 'Ups wystąpił problem',
        description: errorMessage
      });
      return false;
    }
  };

  const saveEdittedPost = async (postId: number, newContent: string) => {
    try {
      const { message, post } = await useFetchWithAuth<{message: string; post: Post}>('/posts', {
        body: {
          postId,
          content: newContent
        },
        method: 'patch',
      });
    
      const foundIndex = posts.value.findIndex(post => post.id === postId);
    
      if(foundIndex !== -1) {
        posts.value[foundIndex].content = post.content;
        posts.value[foundIndex].postHistories = post.postHistories;
      }
    
    
      toast.add({
        title: 'Edycja posta',
        description: message
      });

    } catch (err) {
      const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';
    
      toast.add({
        title: 'Ups wystąpił problem',
        description: errorMessage
      });
    }
      
  };

  const closeTopic = async () => {
    if(!topic.value) return;

    try {
      const res = await useFetchWithAuth<Topic>(`/topics/${topic.value.slug}/close`, {
        method: 'PATCH',
      });
  
      topic.value = res;
    } catch (err) {
      console.error(err);
    }
    
  };

  const openTopic = async () => {
    if(!topic.value) return;
    
    try {
      const res = await useFetchWithAuth<Topic>(`/topics/${topic.value.slug}/open`, {
        method: 'PATCH',
      });
  
      topic.value = res;
    } catch (err) {
      console.error(err);
    }
  };

  const followTopic = async (follow: boolean) => {
    if(!topic.value) return;
    
    try {
      const { message, topic: t } = await useFetchWithAuth<FollowTopicResponse>('/topics/follow', {
        method: 'POST',
        body: {
          topicId: topic.value.id,
          follow
        }
      });
  
      topic.value = t;
  
      toast.add({
        title: message
      });
  
    } catch (err) {
      console.error(err);
    }
  };

  return {
    posts,
    topic,
    meta,
    pinnedPost,

    setPosts,
    fetchPosts,
    saveEdittedPost,
    togglePostPin,
    deletePost,

    closeTopic,
    openTopic,
    followTopic,
  };
});