<template>
  <v-container>
    <!-- Блок с Pattern и временем -->
    <v-card class="pa-4 mb-6" elevation="3">
      <v-card-title>Расписание маршрута</v-card-title>
      <v-row class="mt-2">
        <v-col cols="12" md="6">
          <v-text-field
            v-if="schedule"
            v-model="schedule.schedulePattern.startDate"
            label="Начало действия расписания"
            type="date"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-if="schedule"
            v-model="schedule.schedulePattern.endDate"
            label="Окончание действия расписания"
            type="date"
          />
        </v-col>
        <v-col v-for="day in weekDays" :key="day.value" cols="6" md="3">
          <v-checkbox v-model="selectedDays" :label="day.label" :value="day.value" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-if="schedule"
            v-model="schedule.departureTime"
            label="Время отправления"
            type="time"
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Список остановок -->
    <v-card class="pa-4" elevation="2">
      <v-card-title>Остановки маршрута</v-card-title>

      <v-row
        v-for="stop in routeStore.routeStops"
        :key="stop.order"
        class="mt-4 pa-2 border rounded"
      >
        <v-col cols="12" md="4">
          <v-card-title class="d-flex align-center">
            <v-icon class="me-2">mdi-map-marker</v-icon>
            <span>{{
              `${stop.busStop.locality.name}${stop.busStop.name ? ',' + stop.busStop.name : ''}`
            }}</span>
          </v-card-title>
        </v-col>

        <v-col cols="6" md="2">
          <v-text-field v-model="stop.arrivalTime" label="Прибытие" type="time" />
        </v-col>

        <v-col cols="6" md="2">
          <v-text-field v-model="stop.departureTime" label="Отправление" type="time" />
        </v-col>

        <v-col cols="6" md="2">
          <v-text-field v-model.number="stop.arrivalDayNumber" label="День приб." type="number" />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouteStore } from '../stores/routes'
import { useLoadingStore } from '@/stores/loadingStore'
import { weekDays } from '@/utils/weekDays'
import { createRouteSchedule, type IRouteSchedule } from '@/interfaces/route'

const routeStore = useRouteStore()
const loadingStore = useLoadingStore()
const curScheduleIndex = ref(0)
const selectedDays = ref<number[]>([])
const schedule = ref<IRouteSchedule | null>(null)

const props = defineProps({
  scheduleIdParam: {
    type: String,
    default: null,
  },
})

watch(selectedDays, (newVal) => {
  console.log('Adding')
  schedule.value.schedulePattern.daysOfWeek = newVal.reduce((acc, day) => acc | day, 0)
})

onMounted(async () => {
  loadingStore.start()
  try {
    if (!props.scheduleIdParam) {
      console.log('Adding new schedule')
      schedule.value = createRouteSchedule()
    } else {
      curScheduleIndex.value = routeStore.route.routeSchedules.findIndex(
        (schedule) => schedule.id === props.scheduleIdParam,
      )
      schedule.value = routeStore.route.routeSchedules[curScheduleIndex.value]
      routeStore.restoreRouteStopsFromSegmentSchedules(curScheduleIndex.value)
      /*selectedDays.value = schedule.value.schedulePattern.daysOfWeek
        .toString(2)
        .split('')
        .reverse()
        .map((day, index) => (day === '1' ? index : -1))
        .filter((day) => day !== -1)*/
    }
  } finally {
    loadingStore.stop()
  }
})

onBeforeUnmount(() => {
  console.log('Unmounting')
  if (!props.scheduleIdParam) {
    curScheduleIndex.value = routeStore.route.routeSchedules.push(schedule.value!) - 1
  }
  routeStore.buildUpdatedSegmentSchedules(curScheduleIndex.value)
})
</script>
