<template>
  <v-btn :to="{ name: 'routes-list' }" color="primary">К списку маршрутов</v-btn>
</template>

<script lang="ts">
export default {
  name: 'AddReturnRouteView',
  data() {
    return {
      routeName: '',
      routeNumber: '',
    }
  },
  methods: {},
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
