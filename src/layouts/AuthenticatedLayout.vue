<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Bus Carrier</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" @click="navigate(item.route)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'

const drawer = ref(false)
const router = useRouter()

const items = [
  { title: 'Главная', route: '/' },
  { title: 'Организация', route: '/organization' },
  { title: 'Рейсы', route: '/trips' },
  { title: 'Маршруты', route: '/routes' },
  { title: 'Проданные билеты', route: '/sold-tickets' },
  { title: 'Транспорт', route: '/transport' },
  { title: 'Настройки', route: '/settings' },
]

const navigate = (route: string) => {
  router.push(route)
  drawer.value = false
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
