<template>
  <v-text-field v-model="route.name" label="Название маршрута"></v-text-field>
  <v-text-field v-model="route.number" label="Номер маршрута"></v-text-field>
  <route-points-list v-model="route.stops" />
</template>

<script lang="ts">
import RoutePointsList from '../components/RoutePointsList.vue'
import type { Route } from '@/interfaces/route'
import { useRouteStore } from '../stores/routes'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    RoutePointsList,
  },
  computed: {
    route: {
      get() {
        // Получаем данные из Pinia store
        return useRouteStore().route
      },
      set(value: Route) {
        // Обновляем данные в Pinia store
        useRouteStore().setRoute(value)
      },
    },
  },
})
</script>
