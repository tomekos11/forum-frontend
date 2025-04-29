<template>
  <div class="p-4 rounded-lg shadow-sm bg-slate-800">
    <p>
      Brak postów na tej stronie. Przejdź na początek tematu
    </p>
    <UButton
      label="Kliknij aby przejść na strone 1"
      :to="{
        name: $route.name,
        params: $route.params,
        query: {...$route.query, page: 1 }
      }"
    />
  </div>
</template>