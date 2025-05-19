<template>
  <v-container>
    <v-form @submit.prevent="saveHandler">
      <v-card class="pa-4 mb-6" elevation="3">
        <v-card-title>Информация о водителе</v-card-title>
        <v-divider></v-divider>
        <v-row class="mt-2">
          <v-col cols="12" md="6">
            <v-text-field
              v-if="data"
              v-model="data.employeeNumber"
              label="Табельный номер"
              type="text"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-if="data" v-model="data.surname" label="Фамилия" type="text" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-if="data" v-model="data.name" label="Имя" type="text" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-if="data"
              v-model="data.patronymic"
              label="Отчество"
              type="text"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-if="data"
              v-model="data.dayOfBirth"
              label="Дата рождения"
              type="date"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-if="data"
              v-model="data.licenseNumber"
              label="Водительское удостоверение"
              type="text"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-if="data" v-model="data.userName" label="Логин" type="text" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-if="data" v-model="data.password" label="Пароль" type="text" required />
          </v-col>
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
import { createDriver, type IDriver } from '../../interfaces/transport'
import { driversApi } from '../../api/transportApi'
import router from '@/router'

const data = ref<IDriver | null>(null)

const props = defineProps({
  driverIdParam: {
    type: String,
    default: null,
  },
})

onMounted(async () => {
  try {
    if (props.driverIdParam) {
      data.value = await (await driversApi.getDriverById(props.driverIdParam)).data
    } else {
      data.value = createDriver()
    }
  } catch (e) {
    router.push({ name: 'drivers-list' })
  }
})

const saveHandler = async () => {
  try {
    if (props.driverIdParam) {
      await driversApi.updateDriver(props.driverIdParam, data.value)
    } else {
      await driversApi.createDriver(data.value)
    }
    router.push({ name: 'drivers-list' })
  } catch (e) {
    console.error('Error loading driver data:', e)
  }
}
</script>
