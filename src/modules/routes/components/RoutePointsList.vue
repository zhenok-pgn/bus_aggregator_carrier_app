<template>
  <div>
    <div v-for="stop in modelValue" :key="stop.innerId">
      <div>
        <v-text-field v-model="stop.busStop.name" label="Адрес остановки"></v-text-field>
        <v-text-field v-model="stop.travelTimeInMinutes" label="Время в пути"></v-text-field>
        <v-text-field v-model="stop.boardingTimeInMinutes" label="Время стоянки"></v-text-field>
        <v-text-field v-model="stop.distanceInKm" label="Расстояние"></v-text-field>
        <v-btn @click="addRoutePoint(stop.innerId)">Добавить следующую точку</v-btn>
        <v-btn @click="removeRoutePoint(stop.innerId)">Удалить точку</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { RouteStop } from '@/interfaces/route'
import { generateNumericId } from '@/utils/idGenerator'

export default {
  name: 'RoutePointsList',
  props: {
    modelValue: {
      type: Array as PropType<RouteStop[]>,
      required: true,
    },
  },
  methods: {
    addRoutePoint(innerId: number) {
      const index = this.modelValue.findIndex((stop) => stop.innerId === innerId)
      const newStop = {
        innerId: generateNumericId(),
        busStop: { innerId: generateNumericId(), name: '' },
        boardingTimeInMinutes: 0,
        travelTimeInMinutes: 0,
        distanceInKm: 0,
        order: 0,
      }
      const updatedStops = [...this.modelValue]
      updatedStops.splice(index + 1, 0, newStop)
      updatedStops.forEach((stop, index) => {
        stop.order = index + 1
      })
      console.log(updatedStops)
      this.$emit('update:modelValue', updatedStops)
    },
    removeRoutePoint(innerId: number) {
      const updatedStops = this.modelValue.filter((stop) => stop.innerId !== innerId)
      this.$emit('update:modelValue', updatedStops)
    },
  },
}
</script>

<style scoped>
/* Add styles as needed */
</style>
