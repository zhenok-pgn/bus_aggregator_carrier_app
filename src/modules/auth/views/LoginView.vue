<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field v-model="username" label="Логин" required></v-text-field>
      <v-text-field v-model="password" label="Пароль" type="password" required></v-text-field>
      <v-btn type="submit" color="primary">Войти</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth'

const username = ref(null)
const password = ref(null)
const router = useRouter()
const authStore = useAuthStore()

const goBack = () => {
  router.push('/') // Возврат на предыдущую страницу
}

const login = async () => {
  if (!username.value || !password.value) {
    return // Проверка на пустые поля
  }

  authStore.login(username.value, password.value).then(() => {
    goBack()
  })
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
