<template>
  <v-container>
    <v-data-table :headers="headers" :items="items" hide-default-footer>
      <!-- Колонка с действиями -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          color="primary"
          variant="text"
          @click="editItem(item)"
          class="mr-2"
        ></v-btn>
        <v-btn
          icon="mdi-delete"
          size="small"
          color="error"
          variant="text"
          @click="deleteItem(item)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { driversApi } from '../../api/transportApi'

export default {
  name: 'DriversListView',
  data() {
    return {
      headers: [
        { title: 'Табельный номер', key: 'employeeNumber' },
        { title: 'ФИО', key: 'name' },
        { title: 'Дата рождения', key: 'dayOfBirth' },
        { title: 'Действия', key: 'actions', sortable: false },
      ],

      // Данные таблицы
      items: [] as {
        id: number
        employeeNumber: string
        name: string
        dayOfBirth: string
      }[],
    }
  },

  methods: {
    editItem(item: { id: number; employeeNumber: string; name: string; dayOfBirth: string }) {
      this.$router.push({ name: 'driver-edit', params: { driverIdParam: item.id } })
    },

    deleteItem(item: { id: number; employeeNumber: string; name: string; dayOfBirth: string }) {
      console.log('Удалить:', item)
    },

    async load() {
      const response = await driversApi.getDrivers()
      this.items = response.data.map((driver) => {
        return {
          id: driver.id,
          employeeNumber: driver.employeeNumber,
          name: `${driver.surname} ${driver.name} ${driver.patronymic}`,
          dayOfBirth: driver.dayOfBirth,
        }
      })
    },
  },

  mounted() {
    this.load()
  },
}
</script>
