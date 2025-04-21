<template>
  <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-4 rounded-lg shadow-sm mb-2" >
    <USkeleton class="h-12 w-12 rounded-full" />
  
    <div class="grid gap-2">
      <USkeleton class="h-4 w-[250px]" />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>
