<template>
  <v-container>
    <v-data-table :headers="headers" :items="routes" hide-default-footer>
      <!-- Колонка с действиями -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          color="primary"
          variant="text"
          @click="editItem(item)"
          class="mr-2"
        ></v-btn>
        <v-btn
          icon="mdi-delete"
          size="small"
          color="error"
          variant="text"
          @click="deleteItem(item)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoutesStore } from '../stores/routes'
import { mapState, mapActions } from 'pinia'
import { generateNumericId } from '@/utils/idGenerator'
import type { IRouteSummary } from '@/interfaces/route'

export default defineComponent({
  name: 'RoutesListView',
  data() {
    return {
      headers: [
        { title: '№', key: 'number' },
        { title: 'Название', key: 'name' },
        { title: 'Действия', key: 'actions', sortable: false },
      ],
    }
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

    editItem(item: IRouteSummary) {
      this.$router.push({ name: 'edit-route', params: { routeIdParam: item.id } })
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
        //console.log('Маршруты загружены:', this.routes)
      } catch (error) {
        console.error('Ошибка загрузки маршрутов:', error)
      }
    },
  },

  mounted() {
    this.fetchRoutes() // Загружаем маршруты при монтировании
  },

  unmounted() {
    useRoutesStore().$dispose() // Очищаем хранилище
    console.log('RoutesView unmounted')
  },
})
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
