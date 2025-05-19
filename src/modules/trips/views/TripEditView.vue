<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <!-- Заголовок -->
      <v-card-title class="text-h5" v-if="trip">
        {{ trip.route.name }}
      </v-card-title>

      <v-card-text>
        <!-- Основная информация -->
        <div class="mb-6">
          <div class="text-subtitle-1 mb-2">Тариф</div>
          <v-chip color="primary">Стандартный</v-chip>
        </div>

        <!-- Автобус -->
        <div class="mb-6">
          <div class="text-subtitle-1 mb-2">Автобус</div>
          <div class="text-body-1 font-weight-bold">Mercedes-Benz Sprinter (B211 CE12RUS)</div>
          <v-chip variant="outlined" color="grey" class="mt-1">Автобус не выбран</v-chip>
        </div>

        <!-- Юр. лицо и водитель -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <div class="text-subtitle-1 mb-2">Кэр.лицо</div>
            <div class="text-body-1">ООО "Перевозчик"</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-subtitle-1 mb-2">Водитель</div>
            <v-chip variant="outlined" color="grey">Водитель не выбран</v-chip>
          </v-col>
        </v-row>

        <!-- Номер ведомости -->
        <div class="mb-6">
          <div class="text-subtitle-1 mb-2">Номер посадочной ведомости</div>
          <v-text-field variant="outlined" placeholder="Введите номер"></v-text-field>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Места -->
        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">Места</div>
          <div class="text-body-1">Рассадка: <span class="font-weight-bold">свободная</span></div>
        </div>

        <!-- Сетка мест -->
        <div class="seat-grid mb-4">
          <div v-for="seat in 20" :key="seat" class="seat" @click="selectSeat(seat)">
            {{ seat }}
          </div>
        </div>

        <!-- Ввод мест -->
        <div class="mb-6">
          <v-text-field
            variant="outlined"
            label="Введите интервал мест (например 1-20) или конкретные места через запятую"
          ></v-text-field>
          <div class="text-caption text-grey">
            Для удаления или просмотра детальной информации по месту, щелкните по нему левой кнопкой
            мыши.
          </div>
        </div>

        <!-- Чекбоксы -->
        <div class="mb-4">
          <v-checkbox label="Остановить продажу" color="primary" hide-details></v-checkbox>
          <v-checkbox
            label="Сохранить"
            color="primary"
            hide-details
            model-value="true"
          ></v-checkbox>
        </div>
      </v-card-text>

      <!-- Кнопки действий -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveHandler">Сохранить изменения</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { ITrip } from '../interfaces/trip'
import { tripsApi } from '../api/tripsApi'

export default defineComponent({
  name: 'TripEditView',
  props: {
    tripIdParam: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      trip: null as null | ITrip,
    }
  },

  methods: {
    saveHandler() {
      this.$router.push({ name: 'trips-list' })
    },
  },

  async mounted() {
    this.trip = (await tripsApi.getTripById(this.tripIdParam)).data
  },
})
</script>
