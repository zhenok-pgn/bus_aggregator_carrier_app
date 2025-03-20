// filepath: d:\study programming\visual\bus_carrier\src\views\Routes.vue
<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="!showAddRouteView">
          <h1>Маршруты</h1>
          <!-- List of routes -->
          <v-list v-for="route in routes" :key="route.id">
            <v-list-item>
              {{ route.name }}
            </v-list-item>
          </v-list>
        </div>
        <!-- Buttons -->
        <v-btn v-if="!showAddRouteView" color="primary" @click="switchState">Добавить</v-btn>
        <v-btn v-if="!showAddRouteView" color="secondary" @click="addReverseRoute"
          >Добавить обратный маршрут</v-btn
        >
        <!-- Add Route View Component -->
        <v-btn v-if="showAddRouteView" color="primary" @click="switchState"
          >К списку маршрутов</v-btn
        >
        <AddRouteView v-if="showAddRouteView" @close="showAddRouteView = false" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import AddRouteView from '@/views/AddRouteView.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RoutesView',
  components: {
    AddRouteView,
  },
  data() {
    return {
      routes: [{ id: 1, name: 'Москва-Казань' }], // List of routes
      showAddRouteView: false,
    }
  },
  methods: {
    switchState() {
      this.showAddRouteView = !this.showAddRouteView
    },
    addReverseRoute() {
      // Logic to add reverse route
    },
  },
})
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
