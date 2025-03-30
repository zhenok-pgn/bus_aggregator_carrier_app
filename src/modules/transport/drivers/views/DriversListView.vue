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
export default {
  name: 'DriversListView',
  data() {
    return {
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Название', key: 'name' },
        { title: 'Гос.номер', key: 'description' },
        { title: 'Действия', key: 'actions', sortable: false },
      ],

      // Данные таблицы
      items: [
        { id: 1, name: 'Маршрут 1', description: 'Москва - СПб' },
        { id: 2, name: 'Маршрут 2', description: 'Казань - Сочи' },
        { id: 3, name: 'Маршрут 3', description: 'Екатеринбург - Новосибирск' },
      ],
    }
  },
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
