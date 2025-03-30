<template>
  <v-container>
    <!-- Период и заголовок -->
    <v-row class="mt-4">
      <v-col cols="12" sm="6">
        <DatePicker v-model="filterOptions.startDate" label="С"></DatePicker>
      </v-col>
      <v-col cols="12" sm="6" class="text-sm-right">
        <DatePicker v-model="filterOptions.endDate" label="По"></DatePicker>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="filterOptions.selectedRoute"
          item-value="id"
          item-title="name"
          :items="routes"
          label="Выберите маршрут"
          outlined
        ></v-select>
      </v-col>
      <v-col>
        <v-btn @click="filter">Фильтр</v-btn>
      </v-col>
    </v-row>

    <!-- Список маршрутов -->
    <v-card
      class="mb-4"
      v-for="(trip, index) in filteredTrips"
      :key="index"
      @click="editTrip(index)"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" class="text-center text-sm-left">
            <div class="text-h6">{{ trip.date }}</div>
            <div class="text-h5">{{ trip.time }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-h6">{{ trip.title }}</div>
            <div class="text-subtitle-1">{{ trip.seats }}</div>
          </v-col>
          <v-col cols="12" md="2" class="text-center">
            <v-chip color="green" text-color="white">свободная</v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    {{ coord }}
  </v-container>
</template>

<script lang="ts">
import DatePicker from '@/components/DatePicker.vue'
import { type IRouteSummary } from '@/interfaces/route'

export default {
  name: 'TripsView',
  components: {
    DatePicker,
  },
  data() {
    return {
      filteredTrips: [] as { date: Date; time: string; title: string; seats: number }[],
      filterOptions: { startDate: new Date(), endDate: new Date(), selectedRoute: 0 },
      routes: [] as IRouteSummary[],
      coord: {} as GeolocationPosition,
    }
  },

  methods: {
    filter() {},
    editTrip(id: number) {
      this.$router.push({ name: 'edit-trip', params: { tripIdParam: id } })
    },
  },

  mounted() {
    this.routes.push(
      { id: -1, name: 'Все маршруты', number: -1 },
      ...[
        { id: 1, name: 'route1', number: 1 },
        { id: 2, name: 'route2', number: 2 },
      ],
    )

    this.filteredTrips = [{ date: new Date(), time: '12:20', title: 'test', seats: 20 }]

    if (!navigator.geolocation) {
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
    }
  },
}
</script>
