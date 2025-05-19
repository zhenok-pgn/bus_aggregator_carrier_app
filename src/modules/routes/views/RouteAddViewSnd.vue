<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="2" class="pa-6">
          <!-- Хлебные крошки -->
          <v-breadcrumbs :items="breadcrumbs" class="mb-4" />

          <!-- Содержимое шага -->
          <router-view />

          <!-- Кнопки "Назад / Вперёд" -->
          <v-row class="mt-8" justify="space-between">
            <v-btn @click="goTo(prevStep)" :disabled="!prevStep" color="primary" variant="outlined">
              Назад
            </v-btn>
            <v-btn @click="goTo(nextStep)" color="primary">
              {{ !nextStep ? 'Сохранить' : 'Далее' }}
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, onMounted } from 'vue'
import { useRouteStore } from '../stores/routes'
import { routesApi } from '../api/routesApi'
import { createRoute } from '@/interfaces/route'
import { ca, fi } from 'vuetify/locale'

const route = useRoute()
const router = useRouter()
const routeStore = useRouteStore()

const props = defineProps({
  routeIdParam: {
    type: String,
    default: null,
  },
})

let stepRoutes = [
  { name: 'route-step1', title: 'Шаг 1' },
  { name: 'route-step2', title: 'Шаг 2' },
  { name: 'route-step3', title: 'Шаг 3' },
]

const currentIndex = computed(() => stepRoutes.findIndex((step) => step.name === route.name))

const breadcrumbs = computed(() =>
  stepRoutes.slice(0, currentIndex.value + 1).map((step) => ({
    title: step.title,
    disabled: step.name === route.name,
    to: { name: step.name },
  })),
)

const prevStep = computed(() =>
  currentIndex.value > 0 ? stepRoutes[currentIndex.value - 1].name : null,
)

const nextStep = computed(() =>
  currentIndex.value < stepRoutes.length - 1 ? stepRoutes[currentIndex.value + 1].name : null,
)

async function goTo(stepName) {
  if (stepName) {
    router.push({ name: stepName })
  } else {
    await saveRoute()
  }
}

async function saveRoute() {
  // 📌 Сохранение маршрута
  if (props.routeIdParam) {
    await routesApi.updateRoute(props.routeIdParam, routeStore.route)
  } else {
    await routesApi.createRoute(routeStore.route)
  }
  router.push({ name: 'routes-list' })
}

onBeforeMount(async () => {
  if (props.routeIdParam !== null) {
    stepRoutes = stepRoutes.map((step) => ({
      ...step,
      name: `edit-${step.name}`,
    }))
  } else {
    stepRoutes = stepRoutes.map((step) => ({
      ...step,
      name: `add-${step.name}`,
    }))
  }
})

onMounted(async () => {
  if (routeStore.isAlreadyCreated) {
    return
  }

  try {
    if (props.routeIdParam) {
      const response = await routesApi.getRouteById(props.routeIdParam)
      routeStore.setRoute(response.data)
    } else {
      routeStore.setRoute(createRoute())
    }
  } catch (e) {
    console.error('Ошибка загрузки маршрута:', e)
    router.push({ name: 'routes-list' })
  }
})
</script>
