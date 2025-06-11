<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-text-field
            v-if="routeStore.route"
            v-model="routeStore.route.name"
            label="Название маршрута"
          ></v-text-field>
          <v-text-field
            v-if="routeStore.route"
            v-model="routeStore.route.registrationNumber"
            label="Регистрационный номер маршрута"
          ></v-text-field>
          <v-text-field
            v-if="routeStore.route"
            v-model="routeStore.route.number"
            label="Номер маршрута"
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-for="stop in routeStore.routeStops" :key="stop.order" class="mb-4">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-if="stop.busStop"
                v-model="stop.busStop.name"
                label="Название остановки"
                prepend-icon="mdi-bus-stop"
                readonly
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="stop.busStop.address"
                label="Адрес остановки"
                prepend-icon="mdi-map-marker"
                readonly
                @click="openMapDialog(stop.order)"
              />
            </v-col>
          </v-row>

          <v-row justify="end" class="mt-2">
            <v-btn
              color="primary"
              @click="addRoutePoint(stop.order)"
              prepend-icon="mdi-plus"
              variant="outlined"
              class="me-2"
            >
              Добавить точку
            </v-btn>
            <v-btn
              color="error"
              @click="removeRoutePoint(stop.order)"
              prepend-icon="mdi-delete"
              variant="text"
            >
              Удалить
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- Диалог карты -->
    <MapDialog
      v-if="curEditStopIndex != -1"
      v-model="mapDialog"
      :initCoordinates="{
        lat: routeStore.routeStops[curEditStopIndex].busStop.latitude,
        lon: routeStore.routeStops[curEditStopIndex].busStop.longitude,
      }"
      @addressSelected="onAddressSelected"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouteStore } from '../stores/routes'
import { createBusStop } from '@/interfaces/route'
import MapDialog from '@/components/map/MapDialog.vue'
import type { IMapPlace } from '@/interfaces/IMapPlace'

const routeStore = useRouteStore()
const mapDialog = ref(false)
const curEditStopIndex = ref(-1)

const addRoutePoint = (order: number) => {
  const index = routeStore.routeStops?.findIndex((stop) => stop.order === order)

  if (index === undefined || index === -1) {
    console.error('Invalid order: no matching stop found.')
    return
  }

  const newStop = createBusStop(1)

  const updatedStops = [...(routeStore.routeStops || [])]
  updatedStops.splice(index + 1, 0, newStop)

  // Обновляем порядок
  updatedStops.forEach((stop, idx) => {
    stop.order = idx + 1
  })

  routeStore.setBusStops(updatedStops)
}

const removeRoutePoint = (order: number) => {
  if (!routeStore.routeStops || routeStore.routeStops.length <= 2) {
    console.error('No stops to remove.')
    return
  }
  const updatedStops = routeStore.routeStops.filter((stop) => stop.order !== order)

  // Обновляем порядок
  updatedStops.forEach((stop, idx) => {
    stop.order = idx + 1
  })

  routeStore.setBusStops(updatedStops)
}

const openMapDialog = (order: number) => {
  if (!routeStore.routeStops) return

  curEditStopIndex.value = routeStore.routeStops?.findIndex((stop) => stop.order === order)
  if (routeStore.routeStops[curEditStopIndex.value].busStop) {
    mapDialog.value = true
  } else {
    console.error('Invalid order: no matching stop found.')
  }
}

const onAddressSelected = async (address: IMapPlace) => {
  console.log('onAddressSelected', address)
  const updatedStops = [...(routeStore.routeStops || [])]

  updatedStops[curEditStopIndex.value].busStop = {
    ...updatedStops[curEditStopIndex.value].busStop,
    name: address.osmData.name,
    address: address.osmData.display_name,
    latitude: address.osmData.lat,
    longitude: address.osmData.lon,
    locality: {
      ...updatedStops[curEditStopIndex.value].busStop.locality,
      name: address.settlement.name,
      id: address.settlement.id,
      region: address.settlement.region,
      country: address.settlement.country,
      district: address.settlement.district,
      timezone: address.timezone.timezone,
      offsetMinutes: address.timezone.utc_offset_seconds / 60,
    },
  }
  routeStore.setBusStops(updatedStops)
  curEditStopIndex.value = -1
}

onMounted(async () => {})
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
