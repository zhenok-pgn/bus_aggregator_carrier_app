<template>
  <v-container>
    <v-form @submit.prevent="saveHandler">
      <v-card class="pa-4 mb-6" elevation="3">
        <v-card-title>Информация об автобусе</v-card-title>
        <v-divider></v-divider>
        <v-row class="mt-2">
          <v-col cols="12" md="6">
            <v-text-field v-if="data" v-model="data.vin" label="VIN" type="text" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-if="data" v-model="data.model" label="Модель" type="text" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-if="data"
              v-model="data.stateNumber"
              label="Гос.номер"
              type="text"
              required
            />
          </v-col>
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
        <!-- Список добавленных мест -->
        <v-row v-if="data" class="d-flex flex-wrap">
          <v-chip
            v-for="(seat, index) in data.seats"
            :key="index"
            class="ma-1"
            color="light-blue lighten-4"
            @click="removeSeat(index)"
          >
            {{ seat }}
            <v-icon small class="ml-1">mdi-close</v-icon>
          </v-chip>
        </v-row>
        <v-row class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit">Сохранить</v-btn>
        </v-row>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createBus, type IBus } from '../../interfaces/transport'
import { busesApi } from '../../api/transportApi'
import router from '@/router'

const data = ref<IBus | null>(null)
const inputSeats = ref('')

const props = defineProps({
  busIdParam: {
    type: String,
    default: null,
  },
})

function removeSeat(index: number) {
  data.value.seats = data.value.seats.filter((s) => s !== data.value.seats[index])
}

function addSeats() {
  const newSeats = parseSeats(inputSeats.value)
  if (data.value) {
    data.value.seats = newSeats.map(String)
  }
  inputSeats.value = ''
}

function parseSeats(text: string): number[] {
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
}

onMounted(async () => {
  try {
    if (props.busIdParam) {
      data.value = (await busesApi.getBusById(props.busIdParam)).data
    } else {
      data.value = createBus()
    }
  } catch (e) {
    console.error('Error loading bus data:', e)
    router.push({ name: 'buses-list' })
  }
})

const saveHandler = async () => {
  if (data.value?.seats.length == 0) return
  try {
    if (props.busIdParam) {
      await busesApi.updateBus(props.busIdParam, data.value)
    } else {
      await busesApi.createBus(data.value)
    }
    router.push({ name: 'buses-list' })
  } catch (e) {
    console.error('Error loading bus data:', e)
  }
}
</script>
