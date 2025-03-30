<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item :value="1" :complete="step > 1">Станции</v-stepper-item>
        <v-stepper-item :value="2" :complete="step > 2">Тарифы</v-stepper-item>
        <v-stepper-item :value="3" :complete="step > 3">Расписание</v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="1">
          <route-stations></route-stations>
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <route-tariffs></route-tariffs>
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <route-schedules></route-schedules>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        @click:next="nextStep"
        @click:prev="prevStep"
        :next-text="step != 3 ? 'Далее' : 'Сохранить'"
        :prev-text="'Назад'"
        :disabled="step == 1 ? 'prev' : false"
      >
      </v-stepper-actions>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { generateNumericId } from '@/utils/idGenerator'
import RouteStations from '../components/RouteStations.vue'
import { mapActions } from 'pinia'
import { useRouteStore } from '../stores/routes'
import RouteTariffs from '../components/RouteTariffs.vue'
import RouteSchedules from '../components/RouteSchedules.vue'
import type { RouteSchedule, Tariff } from '@/interfaces/route'

export default defineComponent({
  name: 'RouteAddView',
  props: {
    routeIdParam: {
      type: String,
      default: null,
    }, // 📌 Параметр маршрута для редактирования
  },
  components: {
    RouteStations,
    RouteTariffs,
    RouteSchedules,
  },
  data() {
    return {
      step: 1,
    }
  },
  methods: {
    ...mapActions(useRouteStore, ['setRoute']),
    nextStep() {
      if (this.step < 3) this.step++
      else if (this.step == 3) this.saveRoute()
    },
    prevStep() {
      if (this.step > 1) this.step--
    },

    async saveRoute() {
      // 📌 Сохранение маршрута

      this.$router.push({ name: 'routes-list' })
    },
  },

  beforeMount() {
    if (useRouteStore().isAlreadyCreated) return
    if (this.routeIdParam !== null) {
      const routeId = Number(this.routeIdParam)

      // 📌 Загрузка данных маршрута
      const mockData = [
        {
          id: 2,
          innerId: generateNumericId(),
          name: 'Маршрут 2',
          number: 2,
          carrier: { id: 1, name: 'Перевозчик 1' },
          stops: [
            {
              innerId: generateNumericId(),
              id: 1,
              busStop: { innerId: generateNumericId(), id: 1, name: 'Остановка 1' },
              boardingTimeInMinutes: 20,
              travelTimeInMinutes: 50,
              distanceInKm: 100,
              order: 2,
            },
            {
              innerId: generateNumericId(),
              busStop: { innerId: generateNumericId(), name: 'Остановка 1' },
              boardingTimeInMinutes: 20,
              travelTimeInMinutes: 50,
              distanceInKm: 100,
              order: 2,
            },
          ],
        },
      ]
      const data = mockData.find((route) => route.id === routeId)
      //this.setRoute(data)
    } else {
      //создание нового маршрута
      this.setRoute({
        innerId: generateNumericId(),
        name: '',
        number: 0,
        carrier: { id: 1, name: 'Перевозчик 1' },
        stops: [
          {
            innerId: generateNumericId(),
            busStop: { innerId: generateNumericId(), name: '' },
            boardingTimeInMinutes: 0,
            travelTimeInMinutes: 0,
            distanceInKm: 0,
            order: 1,
          },
        ],
        tariffs: [] as Tariff[],
        schedules: [] as RouteSchedule[],
      })
      //alert('Ошибка! Маршрут не найден')
      //this.$router.push({ name: 'routes-list' })
    }
  },
  unmounted() {
    useRouteStore().$dispose()
    //console.log('unmount')
  },
})
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
