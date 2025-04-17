<template>
  <footer class="bg-slate-950 text-white py-1 text-center flex justify-between px-2">
    <div class="flex items-center gap-4 text-sm text-gray-200">
      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-user" class="text-green-400" />
        {{ data?.activeUsersCount }}
      </div>

      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-user-circle" class="text-gray-400" />
        {{ data?.activeGuestsCount }}
      </div>
    </div>
    <div>
      TS & MR & <s>MS</s>
    </div>
  </footer>
</template>

<script setup lang="ts">

interface ResponseData {
  activeUsersCount: number;
  activeGuestsCount: number;
  totalActiveUsers: number;
}

const { data } = await useAsyncData(async () => {
  try {
    const res = await useFetchWithAuth<ResponseData>('/online');
    return res;
  }
  catch (e) {
    console.error(e);
  }

  return null;
});

</script>
