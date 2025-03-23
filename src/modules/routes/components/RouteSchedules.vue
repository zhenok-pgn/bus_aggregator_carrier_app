<template>
  <div v-if="isSchedulesList">
    <v-btn @click="addTariff">Добавить расписание</v-btn>
    <v-list v-for="schedule in route?.schedules" :key="schedule.innerId">
      <v-list-item>
        <v-list-item-title>{{ schedule.innerId }}</v-list-item-title>
        <v-list-item-subtitle>{{ '' }}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item-action>
        <v-btn @click="removeSchedule(schedule.innerId)">Удалить</v-btn>
        <v-btn @click="editSchedule(schedule.innerId)">Изменить</v-btn>
      </v-list-item-action>
    </v-list>
  </div>
  <div v-else>
    <v-btn @click="dialog = true">К расписаниям маршрута</v-btn>

    <v-menu
      v-model="datePicker1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ props }">
        <v-text-field v-model="formattedStartDate" label="С" readonly v-bind="props"></v-text-field>
      </template>

      <v-date-picker
        :hide-header="true"
        locale="ru"
        v-model="curEditSchedule.startDate"
        @update:modelValue="datePicker1 = false"
      ></v-date-picker>
    </v-menu>

    <v-menu
      v-model="datePicker2"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ props }">
        <v-text-field v-model="formattedEndDate" label="По" readonly v-bind="props"></v-text-field>
      </template>

      <v-date-picker
        :hide-header="true"
        v-model="curEditSchedule.endDate"
        @update:modelValue="datePicker2 = false"
      ></v-date-picker>
    </v-menu>

    <v-select
      v-model="curEditSchedule.tariff"
      item-title="name"
      :items="route?.tariffs"
      label="Выберите тариф"
      outlined
    ></v-select>

    <v-select
      v-model="curEditSchedule.periodicity"
      :items="periodicity"
      item-title="name"
      item-value="id"
      label="Выберите периодичность"
      outlined
    ></v-select>

    <v-btn @click="saveSchedule">Сохранить</v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>Подтверждение</v-card-title>
        <v-card-text>Данные не сохранены. Вы уверены, что хотите выйти?</v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="dialog = false">Отмена</v-btn>
          <v-btn color="green" @click="toList">Подтвердить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { periodicity, type Route, type RouteSchedule, type Tariff } from '@/interfaces/route'
import { useRouteStore } from '../stores/routes'
import { defineComponent } from 'vue'
import { generateNumericId } from '@/utils/idGenerator'

export default defineComponent({
  data() {
    return {
      isSchedulesList: true,
      isEdit: false,
      dialog: false,
      curEditSchedule: {} as RouteSchedule,
      datePicker1: false,
      datePicker2: false,
    }
  },
  computed: {
    route: {
      get() {
        // Получаем данные из Pinia store
        return useRouteStore().route
      },
      set(value: Route) {
        // Обновляем данные в Pinia store
        useRouteStore().setRoute(value)
      },
    },
    formattedStartDate() {
      return this.curEditSchedule.startDate
        ? new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(this.curEditSchedule.startDate))
        : ''
    },
    formattedEndDate() {
      return this.curEditSchedule.endDate
        ? new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(this.curEditSchedule.endDate))
        : ''
    },
    periodicity() {
      return periodicity
    },
  },

  methods: {
    removeSchedule(innerId: number) {
      const updatedSchedules = this.route?.schedules.filter(
        (schedule) => schedule.innerId !== innerId,
      )
      this.route.schedules = updatedSchedules
    },
    addTariff() {
      this.isSchedulesList = false
      this.isEdit = false

      this.curEditSchedule = {
        innerId: generateNumericId(),
        startDate: new Date(),
        endDate: new Date(),
        tariff: this.route?.tariffs[0] ?? ({} as Tariff),
        periodicity: 0,
        departureTimes: [],
        daysOfWeek: [],
        startWith: new Date(),
        interval: 0,
        baseSeatingPlan: '',
        seatingType: 0,
      }
    },
    editSchedule(innerId: number) {
      this.isSchedulesList = false
      this.isEdit = true

      this.curEditSchedule =
        this.route.tariffs[this.route.tariffs.findIndex((tariff) => tariff.innerId === innerId)]
      for (let i = 0; i < this.route.stops.length - 1; i++)
        for (let j = i + 1; j < this.route.stops.length; j++) {
          if (
            !this.curEditSchedule.prices.find(
              (price) =>
                price.from.busStop.innerId === this.route.stops[i].busStop.innerId &&
                price.to.busStop.innerId === this.route.stops[j].busStop.innerId,
            )
          )
            this.curEditSchedule.prices.push({
              innerId: generateNumericId(),
              from: this.route.stops[i],
              to: this.route.stops[j],
              price: 0,
            })
        }
    },
    toList() {
      this.dialog = false
      this.isSchedulesList = true
    },
    saveSchedule() {
      this.isSchedulesList = true
      if (this.isEdit) {
        const index = this.route.tariffs.findIndex(
          (tariff) => tariff.innerId === this.curEditSchedule.innerId,
        )
        this.route.tariffs[index] = this.curEditSchedule
      } else this.route.tariffs.push(this.curEditSchedule)
    },
  },
})
</script>
