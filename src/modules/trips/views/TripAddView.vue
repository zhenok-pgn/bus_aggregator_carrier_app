<template>
  <v-container>
    <v-form @submit.prevent="saveHandler">
      <!-- Заголовок и выбор периода -->
      <v-row class="mt-4">
        <v-col cols="12">
          <h1 class="text-h5 font-weight-bold">Даты планирования</h1>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-if="tripPlanRequest"
            v-model="tripPlanRequest.fromPlanning"
            label="от"
            type="date"
            required
            outlined
            dense
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-if="tripPlanRequest"
            v-model="tripPlanRequest.toPlanning"
            label="до"
            type="date"
            required
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedRouteId"
            :items="routes"
            item-title="name"
            item-value="id"
            label="Выберите маршрут"
            clearable
            chips
            deletable-chips
            outlined
            dense
            required
          >
            <!-- слот для кастомного отображения элементов -->
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <v-list-item-subtitle>
                  {{ `№${item.raw.number}` }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <!-- Слот no-data -->
            <template #no-data>
              <v-list-item>
                <v-list-item-title>{{ `Ничего не найдено` }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col v-if="selectedRouteId" cols="12">
          <v-autocomplete
            v-model="tripPlanRequest!.routeScheduleId"
            :items="filteredSchedules"
            item-title="departureTime"
            item-value="id"
            label="Выберите расписание"
            clearable
            chips
            deletable-chips
            outlined
            dense
            required
          >
            <!-- слот для кастомного отображения элементов -->
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <v-list-item-subtitle>
                  {{ `${item.raw.startDate} - ${item.raw.endDate}` }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <!-- Слот no-data -->
            <template #no-data>
              <v-list-item>
                <v-list-item-title>{{ `Ничего не найдено` }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col v-if="tripPlanRequest?.routeScheduleId" cols="12">
          <v-autocomplete
            v-model="tripPlanRequest!.busId"
            :items="buses"
            item-title="model"
            item-value="id"
            label="Выберите автобус"
            clearable
            chips
            deletable-chips
            outlined
            dense
            required
          >
            <!-- слот для кастомного отображения элементов -->
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <v-list-item-subtitle>
                  {{ `${item.raw.stateNumber}, ${item.raw.seats.length} мест` }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <!-- Слот no-data -->
            <template #no-data>
              <v-list-item>
                <v-list-item-title>{{ `Ничего не найдено` }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col v-if="tripPlanRequest?.routeScheduleId" cols="12">
          <v-autocomplete
            v-model="tripPlanRequest!.driverId"
            :items="drivers"
            item-title="employeeNumber"
            item-value="id"
            label="Выберите водителя"
            clearable
            chips
            deletable-chips
            outlined
            dense
            required
          >
            <!-- слот для кастомного отображения элементов -->
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <v-list-item-subtitle>
                  {{ `${item.raw.surname} ${item.raw.name} ${item.raw.patronymic}` }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <!-- Слот no-data -->
            <template #no-data>
              <v-list-item>
                <v-list-item-title>{{ `Ничего не найдено` }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit">Сохранить</v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { type IRouteScheduleSummary, type IRouteSummary } from '@/interfaces/route'
import { routeSchedulesApi } from '@/modules/routes/api/routesApi'
import type { IBus, IDriver } from '@/modules/transport/interfaces/transport'
import { createTripPlanRequest, type ITripPlanRequest } from '../interfaces/trip'
import { busesApi, driversApi } from '@/modules/transport/api/transportApi'
import { tripsApi } from '../api/tripsApi'

export default defineComponent({
  name: 'TripAddView',
  data() {
    return {
      routes: [] as IRouteSummary[],
      schedules: [] as IRouteScheduleSummary[],
      filteredSchedules: [] as IRouteScheduleSummary[],
      drivers: [] as IDriver[],
      buses: [] as IBus[],
      tripPlanRequest: null as null | ITripPlanRequest,
      selectedRouteId: null as null | string,
    }
  },

  methods: {
    async saveHandler() {
      try {
        await tripsApi.createTrip(this.tripPlanRequest)
        this.$router.push({ name: 'trips-list' })
      } catch (e) {
        console.error('error during saving trip', e)
      }
    },
  },

  watch: {
    selectedRouteId(newValue) {
      this.filteredSchedules = this.schedules.filter((schedule) => schedule.route.id === newValue)
    },
  },

  async mounted() {
    this.tripPlanRequest = createTripPlanRequest()
    this.schedules = (await routeSchedulesApi.getRouteSchedules()).data
    this.routes = this.schedules
      .map((schedule) => schedule.route)
      .filter((route, index, self) => index === self.findIndex((r) => r.id === route.id))

    this.drivers = (await driversApi.getDrivers()).data
    this.buses = (await busesApi.getBuses()).data
  },
})
</script>
