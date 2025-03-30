<template>
  <v-container>
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
      <v-row>
        <v-col>
          <v-btn @click="dialog = true">К расписаниям маршрута</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <DatePicker v-model="curEditSchedule.startDate" label="С"></DatePicker>
        </v-col>
        <v-col cols="12" sm="6">
          <DatePicker v-model="curEditSchedule.endDate" label="По"></DatePicker>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-select
            v-model="curEditSchedule.tariff"
            item-title="name"
            :items="route?.tariffs"
            label="Выберите тариф"
            outlined
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-select
            v-model="curEditSchedule.periodicity"
            :items="periodicity"
            item-title="name"
            item-value="id"
            label="Выберите периодичность"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="curEditSchedule.periodicity === 3">
        <v-col v-for="day in daysOfWeek" :key="day.id" cols="auto">
          <v-checkbox
            v-model="curEditSchedule.daysOfWeek"
            :label="day.name"
            :value="day.id"
            density="compact"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row v-if="curEditSchedule.periodicity === 2">
        <v-col cols="12" sm="6">
          <DatePicker v-model="curEditSchedule.startWith" label="Создавать начиная с"></DatePicker>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="curEditSchedule.interval"
            type="number"
            label="Введите число"
            :hide-spin-buttons="false"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field type="time" v-model="curDepTime"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn @click="addDepartureTime">Добавить</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="curEditSchedule.departureTimes.length > 0">
        <v-col v-for="(time, index) in curEditSchedule.departureTimes" :key="index" cols="auto">
          <v-chip
            @mouseover="hoveredIndex = index"
            @mouseleave="hoveredIndex = -1"
            @click="removeDepartureTime(index)"
          >
            <template v-if="hoveredIndex === index">
              <v-icon>mdi-delete</v-icon>
            </template>
            <template v-else>
              {{ time }}
            </template>
          </v-chip>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-select
            v-model="curEditSchedule.seatingType"
            :items="seatingType"
            item-title="name"
            item-value="id"
            label="Выберите тип рассадки"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <!-- Список добавленных мест -->
      <v-row class="d-flex flex-wrap">
        <v-chip
          v-for="(seat, index) in seats"
          :key="index"
          class="ma-1"
          color="light-blue lighten-4"
          @click="removeSeat(seat)"
        >
          {{ seat }}
          <v-icon small class="ml-1">mdi-close</v-icon>
        </v-chip>
      </v-row>

      <!-- Поле ввода и кнопка -->
      <v-row class="mt-3">
        <v-col cols="10">
          <v-text-field
            v-model="inputSeats"
            label="Введите интервал мест (например 1-20) или конкретные места через запятую"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-btn color="green" icon @click="addSeats">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>

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
  </v-container>
</template>

<script lang="ts">
import {
  daysOfWeek,
  periodicity,
  seatingType,
  type Route,
  type RouteSchedule,
  type Tariff,
} from '@/interfaces/route'
import { useRouteStore } from '../stores/routes'
import { defineComponent } from 'vue'
import { generateNumericId } from '@/utils/idGenerator'
import DatePicker from '@/components/DatePicker.vue'

export default defineComponent({
  data() {
    return {
      isSchedulesList: true,
      isEdit: false,
      dialog: false,
      curEditSchedule: {} as RouteSchedule,
      hoveredIndex: -1,
      curDepTime: '',
      seats: [] as number[],
      inputSeats: '',
    }
  },
  components: {
    DatePicker,
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
    periodicity() {
      return periodicity
    },
    daysOfWeek() {
      return daysOfWeek
    },
    seatingType() {
      return seatingType
    },
  },

  methods: {
    removeSchedule(innerId: number) {
      const updatedSchedules = this.route.schedules.filter(
        (schedule) => schedule.innerId !== innerId,
      )
      this.route.schedules = updatedSchedules
    },
    removeSeat(seat: number) {
      this.seats = this.seats.filter((s) => s !== seat)
      this.curEditSchedule.baseSeatingPlan = JSON.stringify(this.seats)
    },
    addSeats() {
      const newSeats = this.parseSeats(this.inputSeats)
      this.seats = Array.from(new Set([...this.seats, ...newSeats])).sort((a, b) => a - b)
      this.curEditSchedule.baseSeatingPlan = JSON.stringify(this.seats)
      this.inputSeats = ''
    },
    parseSeats(text: string): number[] {
      const seatSet = new Set<number>()
      text.split(',').forEach((part) => {
        part = part.trim()
        if (/^\d+-\d+$/.test(part)) {
          const [start, end] = part.split('-').map(Number)
          for (let i = start; i <= end; i++) seatSet.add(i)
        } else if (/^\d+$/.test(part)) {
          seatSet.add(Number(part))
        }
      })
      return Array.from(seatSet).sort((a, b) => a - b)
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
        this.route.schedules[
          this.route.schedules.findIndex((schedule) => schedule.innerId === innerId)
        ]
      this.seats =
        this.curEditSchedule.baseSeatingPlan != ''
          ? JSON.parse(this.curEditSchedule.baseSeatingPlan)
          : ''
      console.log(
        this.route.schedules[
          this.route.schedules.findIndex((schedule) => schedule.innerId === innerId)
        ],
      )
    },
    toList() {
      this.dialog = false
      this.isSchedulesList = true
    },
    addDepartureTime() {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/
      if (!timePattern.test(this.curDepTime)) {
        return
      }
      this.curEditSchedule.departureTimes.push(this.curDepTime)
      this.curDepTime = ''
    },
    removeDepartureTime(index: number) {
      this.curEditSchedule.departureTimes.splice(index, 1)
    },
    saveSchedule() {
      this.isSchedulesList = true
      if (this.isEdit) {
        const index = this.route.schedules.findIndex(
          (schedule) => schedule.innerId === this.curEditSchedule.innerId,
        )
        this.route.schedules[index] = this.curEditSchedule
      } else this.route.schedules.push(this.curEditSchedule)
    },
  },
})
</script>
