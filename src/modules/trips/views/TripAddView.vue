<template>
  <v-container class="max-width">
    <!-- Заголовок и выбор периода -->
    <v-row class="mt-4">
      <v-col cols="12">
        <h1 class="text-h5 font-weight-bold">Запланируйте рейсы на</h1>
      </v-col>

      <v-col cols="6" sm="3">
        <v-btn block color="primary" variant="outlined">30 дней</v-btn>
      </v-col>

      <v-col cols="6" sm="3">
        <v-btn block color="primary" variant="outlined">90 дней</v-btn>
      </v-col>

      <v-col cols="12">
        <p class="text-caption mt-2">или введите произвольные даты</p>
      </v-col>
    </v-row>

    <!-- Выбор дат -->
    <v-row>
      <v-col cols="6">
        <v-text-field
          label="от"
          type="date"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          label="до"
          type="date"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Карточка маршрута -->
    <v-data-table
      :headers="headers"
      v-model="selected"
      :items="items"
      item-value="id"
      show-select
      hide-default-footer
    ></v-data-table>

    <v-row>
      <v-btn variant="outlined" color="grey" @click="cancelHandler">Отмена</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="saveHandler">Сохранить</v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TripAddView',
  data() {
    return {
      selected: [],
      headers: [{ title: 'Название', key: 'name' }],
      items: [
        {
          id: 1,
          name: 'route1',
        },
        {
          id: 2,
          name: 'route2',
        },
        {
          id: 3,
          name: 'route3',
        },
      ],
    }
  },

  methods: {
    saveHandler() {
      this.$router.push({ name: 'trips-list' })
    },
    cancelHandler() {
      this.$router.push({ name: 'trips-list' })
    },
  },
})
</script>
