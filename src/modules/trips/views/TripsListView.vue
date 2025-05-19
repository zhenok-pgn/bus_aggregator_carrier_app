<template>
  <v-container>
    <!-- Фильтры -->
    <v-card class="pa-4 mb-6">
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field v-model="filterOptions.startDate" label="С" type="date" outlined dense />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="filterOptions.endDate" label="По" type="date" outlined dense />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="filterOptions.selectedRoutes"
            :items="routes"
            item-title="name"
            item-value="id"
            label="Выберите маршруты"
            multiple
            clearable
            chips
            deletable-chips
            outlined
            dense
          />
          <small class="text-grey">Если маршруты не выбраны — отображаются все</small>
        </v-col>
        <v-col cols="12" md="4" class="d-flex align-end justify-end">
          <v-btn color="primary" @click="filter" block>Применить фильтр</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Список рейсов -->
    <v-card
      v-for="(trip, index) in filteredTrips"
      :key="trip.id || index"
      class="mb-4 elevation-2"
      @click="editTrip(trip.id)"
      :ripple="true"
    >
      <v-card-text class="pa-4">
        <v-row no-gutters align="center">
          <!-- Дата и время -->
          <v-col cols="12" sm="4" class="pr-sm-4">
            <div class="d-flex flex-column">
              <div class="text-subtitle-1 font-weight-medium grey--text text--darken-2">
                {{ trip.departureDate }}
              </div>
              <div class="text-h4 primary--text font-weight-bold mt-1">
                {{ trip.schedule.departureTime }}
              </div>
            </div>
          </v-col>

          <!-- Информация о рейсе -->
          <v-col cols="12" sm="6" class="pt-3 pt-sm-0">
            <div class="d-flex flex-column">
              <div class="text-h6 font-weight-medium">
                {{ trip.route.name }}
              </div>

              <div class="d-flex align-center mt-2">
                <v-icon small class="mr-2 grey--text text--darken-1">mdi-account-tie</v-icon>
                <span class="text-subtitle-2">
                  <span class="grey--text text--darken-1">Водитель:</span>
                  <strong class="ml-1">{{ trip.driver.surname || 'не назначен' }}</strong>
                </span>
              </div>

              <div class="d-flex align-center mt-1">
                <v-icon small class="mr-2 grey--text text--darken-1">mdi-bus</v-icon>
                <span class="text-subtitle-2">
                  <span class="grey--text text--darken-1">Автобус:</span>
                  <strong class="ml-1">{{ trip.bus.model || 'не назначен' }}</strong>
                </span>
              </div>
            </div>
          </v-col>

          <!-- Статус -->
          <v-col cols="12" sm="2" class="pt-3 pt-sm-0 text-sm-right">
            <v-chip
              small
              :color="trip.available ? 'green lighten-4' : 'red lighten-4'"
              :text-color="trip.available ? 'green darken-2' : 'red darken-2'"
              class="px-3 font-weight-medium"
            >
              <v-icon left small>
                {{ trip.available ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              {{ trip.available ? 'Свободна' : 'Занята' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { type IRouteSummary } from '@/interfaces/route'
import { routesApi } from '@/modules/routes/api/routesApi'
import { DateOnly } from '@/utils/dateTime'
import { tripsApi } from '../api/tripsApi'
import type { ITrip } from '../interfaces/trip'

export default defineComponent({
  name: 'TripsView',
  data() {
    return {
      filteredTrips: [] as ITrip[],
      routes: [] as IRouteSummary[],
      filterOptions: {
        startDate: new DateOnly().toString(),
        endDate: new DateOnly().toString(),
        selectedRoutes: [] as string[],
      },
    }
  },
  methods: {
    async filter() {
      this.filteredTrips = (await tripsApi.getTrips(this.filterOptions)).data
    },
    editTrip(id: string) {
      this.$router.push({ name: 'edit-trip', params: { tripIdParam: id } })
    },
  },
  async mounted() {
    this.routes = (await routesApi.getRoutes()).data

    /*this.routes = [
      { id: '1', name: 'Маршрут 1', number: '1', registrationNumber: '1', carrierId: '7' },
      { id: '2', name: 'Маршрут 2', number: '2', registrationNumber: '2', carrierId: '7' },
      { id: '3', name: 'Маршрут 3', number: '3', registrationNumber: '3', carrierId: '7' },
    ]

    this.filteredTrips = [
      { date: new Date(), time: '12:20', title: 'Маршрут 1 — Тест', seats: 20, routeId: 1 },
      { date: new Date(), time: '14:30', title: 'Маршрут 2 — Тест', seats: 10, routeId: 2 },
    ]*/
  },
})
</script>

<!-- if (!navigator.geolocation) {
      console.log('Geolocation не поддерживается вашим браузером')
    } else {
      console.log('Определение местоположения…')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position)
          this.coord = position
        },
        () => {
          console.log('Невозможно получить ваше местоположение')
        },
      )
    }-->
