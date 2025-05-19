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
import { busesApi } from '../../api/transportApi'
import type { IBus } from '../../interfaces/transport'

export default {
  name: 'BusesListView',
  data() {
    return {
      headers: [
        { title: 'VIN', key: 'vin' },
        { title: 'Модель', key: 'model' },
        { title: 'Гос.номер', key: 'stateNumber' },
        { title: 'Действия', key: 'actions', sortable: false },
      ],
      items: [],
    }
  },

  methods: {
    editItem(item: IBus) {
      this.$router.push({ name: 'bus-edit', params: { busIdParam: item.id } })
    },

    deleteItem(item: IBus) {
      console.log('Удалить:', item)
    },

    async load() {
      const response = await busesApi.getBuses()
      this.items = response.data
    },
  },

  mounted() {
    this.load()
  },
}
</script>
