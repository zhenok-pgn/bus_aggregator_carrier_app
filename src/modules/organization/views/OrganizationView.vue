<template>
  <v-container>
    <v-row align="center" justify="center" class="mt-4">
      <v-btn color="red" @click="logout">Выйти</v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/stores/auth'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'

const router = useRouter()

const logout = async () => {
  try {
    await useAuthStore().logout()
    router.push('/login')
    toast.success('Вы вышли из системы')
  } catch (error) {
    toast.error('Ошибка при выходе:' + error.message)
  }
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
