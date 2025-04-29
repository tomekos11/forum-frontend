<template>
  <div class="space-y-4">
    <no-posts v-if="!postsStore.posts || !postsStore.posts.length" />


    <template v-else>
      <post
        v-for="(post) in postsStore.posts"
        :key="post.id"
        :post="post"
      />
    </template>

  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '~/stores/posts';

const postsStore = usePostsStore();

</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
