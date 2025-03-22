<template>
  <v-container>
    <v-row>
      <v-col>
        <div>
          <h1>Маршруты</h1>
          <!-- List of routes -->
          <v-list v-for="route in routes" :key="route.id">
            <v-list-item>
              {{ route.name }}
              <v-btn :to="{ name: 'add-route', params: { routeIdParam: route.id } }" color="primary"
                >Изменить</v-btn
              >
            </v-list-item>
          </v-list>
        </div>
        <!-- Buttons -->
        <v-btn :to="{ name: 'add-route', params: { routeIdParam: generateId() } }" color="primary"
          >Добавить</v-btn
        >
        <v-btn :to="{ name: 'add-return-route' }" color="secondary"
          >Добавить обратный маршрут</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoutesStore } from '../stores/routes'
import { mapState, mapActions } from 'pinia'
import { generateNumericId } from '@/utils/idGenerator'
import type { IRouteSummary, Route } from '@/interfaces/route'

export default defineComponent({
  name: 'RoutesView',
  data() {
    return {}
  },

  computed: {
    // 📌 Доступ к состоянию из Pinia
    ...mapState(useRoutesStore, ['routes']),
  },

  methods: {
    // 📌 Доступ к экшену загрузки маршрутов
    ...mapActions(useRoutesStore, ['setRoutes']),

    generateId() {
      return generateNumericId()
    },

    async fetchRoutes() {
      try {
        //const response = await fetch('/api/routes')
        //const data = await response.json()
        const mockData: IRouteSummary[] = [
          {
            id: 1,
            name: 'Маршрут 1',
            number: 1,
          },
          {
            id: 2,
            name: 'Маршрут 2',
            number: 2,
          },
          {
            id: 3,
            name: 'Маршрут 3',
            number: 3,
          },
        ]

        this.setRoutes(mockData) // Обновляем хранилище
        console.log('Маршруты загружены:', this.routes)
      } catch (error) {
        console.error('Ошибка загрузки маршрутов:', error)
      }
    },
  },

  mounted() {
    this.fetchRoutes() // Загружаем маршруты при монтировании
  },
})
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
