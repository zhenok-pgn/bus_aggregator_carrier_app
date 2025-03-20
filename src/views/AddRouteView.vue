<template>
  <v-stepper v-model="step">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-stepper-header>
            <v-stepper-item :value="1" :complete="step > 1">Станции</v-stepper-item>
            <v-stepper-item :value="2" :complete="step > 2">Тарифы</v-stepper-item>
            <v-stepper-item :value="3" :complete="step > 3">Расписание</v-stepper-item>
            <v-stepper-item :value="4" :complete="step > 4">Характеристики</v-stepper-item>
          </v-stepper-header>
        </v-col>
      </v-row>
    </v-container>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <div>
          <v-text-field v-model="routeName" label="Название маршрута"></v-text-field>
          <v-text-field v-model="routeNumber" label="Номер маршрута"></v-text-field>
          <div v-for="(point, index) in routePoints" :key="index">
            <v-text-field :label="'Точка маршрута ' + (index + 1)"></v-text-field>
          </div>
          <v-btn @click="addRoutePoint">Добавить точку маршрута</v-btn>
        </div>
      </v-stepper-window-item>

      <v-stepper-window-item :value="2">
        <div>Тарифы</div>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <div>Расписание</div>
      </v-stepper-window-item>

      <v-stepper-window-item :value="4">
        <div>Характеристики</div>
      </v-stepper-window-item>
    </v-stepper-window>

    <v-stepper-actions
      @click:next="nextStep"
      @click:prev="prevStep"
      :next-text="'Далее'"
      :prev-text="'Назад'"
    >
    </v-stepper-actions>
  </v-stepper>
</template>

<script lang="ts">
export default {
  name: 'AddRouteView',
  data() {
    return {
      step: 1,
      routeName: '',
      routeNumber: '',
      routePoints: [''],
    }
  },
  methods: {
    nextStep() {
      if (this.step < 4) this.step++
    },
    prevStep() {
      if (this.step > 1) this.step--
    },
    addRoutePoint() {
      this.routePoints.push('')
    },
  },
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
