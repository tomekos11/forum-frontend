<template>
  {{ post }}
</template>

<script setup lang="ts">
import type { Post } from '~/types/types';

// Props
interface Props {
  post: Post;
}

defineProps<Props>();

</script>