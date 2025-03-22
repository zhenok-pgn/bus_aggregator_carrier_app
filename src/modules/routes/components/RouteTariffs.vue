<template>
  <div v-if="isTariffsList">
    <v-btn @click="addTariff">Добавить тариф</v-btn>
    <v-list v-for="tariff in route.tariffs" :key="tariff.innerId">
      <v-list-item>
        <v-list-item-title>{{ tariff.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ '' }}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item-action>
        <v-btn @click="removeTariff(tariff.innerId)">Удалить</v-btn>
        <v-btn @click="editTariff(tariff.innerId)">Изменить</v-btn>
      </v-list-item-action>
    </v-list>
  </div>
  <div v-else>
    <v-btn @click="toList">К списку тарифов</v-btn>
    <v-text-field
      v-model="route.tariffs[curEditTariffIndex].name"
      label="Название тарифа"
    ></v-text-field>
    <v-data-table :items="items" :headers="headers">
      <template v-slot:item.name="{ item }">
        <v-text-field v-model="item.name" density="compact"></v-text-field>
      </template>

      <template v-slot:item.age="{ item }">
        <v-text-field v-model="item.age" type="number" density="compact"></v-text-field>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn color="red" @click="removeItem(item)">Удалить</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import type { Route } from '@/interfaces/route'
import { useRouteStore } from '../stores/routes'
import { defineComponent } from 'vue'
import { generateNumericId } from '@/utils/idGenerator'

export default defineComponent({
  data() {
    return {
      isTariffsList: true,
      curEditTariffIndex: -1,
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
  },

  methods: {
    removeTariff(innerId: number) {
      const updatedTariffs = this.route.tariffs.filter((tariff) => tariff.innerId !== innerId)
      this.route.tariffs = updatedTariffs
    },
    addTariff() {
      this.isTariffsList = false
      this.curEditTariffIndex =
        this.route.tariffs.push({ innerId: generateNumericId(), name: 'hello' }) - 1
    },
    editTariff(innerId: number) {
      this.isTariffsList = false
      this.curEditTariffIndex = this.route.tariffs.findIndex((tariff) => tariff.innerId === innerId)
    },
    toList() {
      this.isTariffsList = true
    },
  },
})
</script>
