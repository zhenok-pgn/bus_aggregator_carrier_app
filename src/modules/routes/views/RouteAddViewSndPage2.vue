<template>
  <v-container>
    <v-data-table :headers="headers" :items="items" hide-default-footer>
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

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouteStore } from '../stores/routes'
import { useLoadingStore } from '@/stores/loadingStore'
import { getDaysOfWeekString } from '@/utils/weekDays'
import { DateOnly, TimeOnly } from '@/utils/dateTime'
import router from '@/router'

const routeStore = useRouteStore()
const loadingStore = useLoadingStore()

const headers = [
  { title: 'Даты действия', key: 'dates' },
  { title: 'Время отправления', key: 'departure' },
  { title: 'Дни недели', key: 'daysOfWeek' },
  { title: 'Действия', key: 'actions', sortable: false },
]

// Данные таблицы
const items = ref<{ id: string; dates: string; departure: string; daysOfWeek: string }[]>([])

const editItem = (item: { id: string }) => {
  // Логика редактирования элемента
  console.log('Edit item:', item)
  const routeName = router.currentRoute.value.path.includes('add')
    ? 'add-route-step2-edit'
    : 'edit-route-step2-edit'

  router.push({ name: routeName, params: { scheduleIdParam: item.id } })
  router.push({ name: 'add-route-step2-edit', params: { scheduleIdParam: item.id } })
}

const deleteItem = (item: { id: string }) => {
  // Логика редактирования элемента
  console.log('delete item:', item)
}

onMounted(async () => {
  loadingStore.start()
  try {
    items.value = routeStore.route.routeSchedules.map((schedule) => {
      return {
        id: schedule.id,
        dates: `${schedule.schedulePattern.startDate} - ${schedule.schedulePattern.endDate}`,
        departure: schedule.departureTime,
        daysOfWeek: getDaysOfWeekString(schedule.schedulePattern.daysOfWeek),
      }
    })
  } finally {
    loadingStore.stop()
  }
})
</script>
