<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <strong>Полное наименование:</strong> {{ carrier.fullName }}
          </v-col>
          <v-col cols="12" sm="6"> <strong>ИНН:</strong> {{ carrier.inn }} </v-col>
          <v-col cols="12" sm="6"> <strong>ОГРН:</strong> {{ carrier.ogrn }} </v-col>
          <v-col cols="12" sm="6"> <strong>Телефон:</strong> {{ carrier.phone }} </v-col>
          <v-col cols="12" sm="6"> <strong>Сайт:</strong> {{ carrier.website }} </v-col>
          <v-col cols="12" sm="6"> <strong>Email:</strong> {{ carrier.email }} </v-col>
          <v-col cols="12">
            <strong>Юридический адрес:</strong>
            <p>{{ carrier.legalAddress }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="logout">Выйти</v-btn>
      </v-card-actions>
    </v-card>
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
  } catch (error: any) {
    toast.error('Ошибка при выходе: ' + error.message)
  }
}

// Тестовые данные перевозчика
const carrier = {
  fullName: 'ООО "МежРегионТранс"',
  inn: '7701234567',
  ogrn: '1027700132195',
  phone: '+7 (495) 123-45-67',
  website: 'https://mezhregiontrans.ru',
  email: 'info@mezhregiontrans.ru',
  legalAddress: 'г. Москва, ул. Логистическая, д. 5, офис 12',
}
</script>
