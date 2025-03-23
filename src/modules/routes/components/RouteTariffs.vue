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
    <v-btn @click="dialog = true">К списку тарифов</v-btn>
    <v-text-field v-model="curEditTariff.name" label="Название тарифа"></v-text-field>

    <v-list v-for="price in curEditTariff.prices" :key="price.innerId">
      <v-list-item>
        <v-list-item-title
          >{{ price.from.busStop.name }} - {{ price.to.busStop.name }}</v-list-item-title
        >
        <v-list-item-subtitle>{{ '' }}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item-action>
        <v-text-field v-model="price.price" label="Цена"></v-text-field>
      </v-list-item-action>
    </v-list>

    <v-btn @click="saveTariff">Сохранить</v-btn>
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
import type { Route, SegmentPrice, Tariff } from '@/interfaces/route'
import { useRouteStore } from '../stores/routes'
import { defineComponent } from 'vue'
import { generateNumericId } from '@/utils/idGenerator'

export default defineComponent({
  data() {
    return {
      isTariffsList: true,
      isEdit: false,
      dialog: false,
      curEditTariff: {} as Tariff,
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
      this.isEdit = false

      const prices = [] as SegmentPrice[]
      for (let i = 0; i < this.route.stops.length - 1; i++)
        for (let j = i + 1; j < this.route.stops.length; j++) {
          prices.push({
            innerId: generateNumericId(),
            from: this.route.stops[i],
            to: this.route.stops[j],
            price: 0,
          })
        }
      this.curEditTariff = { innerId: generateNumericId(), name: '', prices: prices }
    },
    editTariff(innerId: number) {
      this.isTariffsList = false
      this.isEdit = true

      this.curEditTariff =
        this.route.tariffs[this.route.tariffs.findIndex((tariff) => tariff.innerId === innerId)]
      for (let i = 0; i < this.route.stops.length - 1; i++)
        for (let j = i + 1; j < this.route.stops.length; j++) {
          if (
            !this.curEditTariff.prices.find(
              (price) =>
                price.from.busStop.innerId === this.route.stops[i].busStop.innerId &&
                price.to.busStop.innerId === this.route.stops[j].busStop.innerId,
            )
          )
            this.curEditTariff.prices.push({
              innerId: generateNumericId(),
              from: this.route.stops[i],
              to: this.route.stops[j],
              price: 0,
            })
        }
    },
    toList() {
      this.dialog = false
      this.isTariffsList = true
    },
    saveTariff() {
      this.isTariffsList = true
      if (this.isEdit) {
        const index = this.route.tariffs.findIndex(
          (tariff) => tariff.innerId === this.curEditTariff.innerId,
        )
        this.route.tariffs[index] = this.curEditTariff
      } else this.route.tariffs.push(this.curEditTariff)
    },
  },
})
</script>
