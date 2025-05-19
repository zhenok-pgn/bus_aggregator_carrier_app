<template>
  <v-dialog v-model="dialogValue" max-width="800" :fullscreen="isSmallScreen" persistent>
    <v-card>
      <v-card-title>Выберите адрес</v-card-title>
      <v-card-text>
        <SearchAddressDropdown v-model="searchRequest" />

        <div id="map" style="height: 400px"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="confirm">Подтвердить</v-btn>
        <v-btn text @click="closeDialog">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import L from 'leaflet'
import { useDisplay } from 'vuetify'
import geocoder from '@/utils/geocoder'
import type { IMapPlace } from '@/interfaces/IMapPlace'
import SearchAddressDropdown from '@/components/SearchAddressDropdown.vue'
import { useLoadingStore } from '@/stores/loadingStore'
import type { fi } from 'vuetify/locale'

const props = defineProps<{
  modelValue: boolean
  initCoordinates: {
    lat: number
    lon: number
  }
}>()

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'addressSelected', address: IMapPlace): void
}>()

const { smAndDown } = useDisplay()
const isSmallScreen = smAndDown
const searchRequest = ref<IMapPlace>()
const marker = ref<L.Marker | null>(null)
const map = ref<L.Map | null>(null)
const loadingStore = useLoadingStore()

const initMap = () => {
  loadingStore.start()
  try {
    map.value = L.map('map').setView([55.751244, 37.618423], 10)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.value)

    // Установка начальной метки
    if (props.initCoordinates) {
      console.log(props.initCoordinates)
      const latLng = L.latLng(props.initCoordinates.lat, props.initCoordinates.lon)
      setMarkerNearest(latLng)
    }

    setUpClickListener()
  } finally {
    loadingStore.stop()
  }
}
const setUpClickListener = () => {
  map.value!.on('click', async (e) => {
    const latlng = e.latlng
    setMarkerNearest(latlng)
  })
}
const setMarkerNearest = async (latLng: L.LatLng) => {
  const result = await getNearestObject(latLng)
  setMarker(L.latLng(result?.lat, result?.lon))
  searchRequest.value = { osmData: result, timezone: {} }
}
const setMarker = (latLng: L.LatLng) => {
  if (marker.value) {
    marker.value.setLatLng(latLng)
  } else {
    marker.value = L.marker(latLng, {
      icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    }).addTo(map.value)
  }

  map.value!.setView(latLng, map.value!.getZoom())
}

async function getNearestObject(latlng: L.LatLng) {
  //const query = `[out:json]; is_in(${latlng.lat},${latlng.lng})->.a; (area.a[place="city"]; area.a[place="town"]; area.a[place="village"]; area.a[place="hamlet"];area.a[place="locality"];); out body 1;`

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json&addressdetails=1`

  const response = await fetch(url)

  const data = await response.json()
  //console.log(data)
  return data
}

watch(searchRequest, (newValue) => {
  setMarker(L.latLng(newValue?.osmData?.lat, newValue?.osmData?.lon))
})

const confirm = async () => {
  if (searchRequest.value) {
    loadingStore.start()
    try {
      let isAbleToClose = false
      isAbleToClose = await setTimezone()
      isAbleToClose = await setSettlment()
      if (!isAbleToClose) {
        console.log('Не удалось установить settlement')
        return
      }
    } finally {
      loadingStore.stop()
    }
    emit('addressSelected', searchRequest.value)
    closeDialog()
  }
}

const setTimezone = async () => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${searchRequest.value.osmData.lat}&longitude=${searchRequest.value.osmData.lon}&timezone=auto`,
  )
  const data = await response.json()
  searchRequest.value!.timezone = data
  return true
}

const setSettlment = async () => {
  const query = `[out:json][timeout:25];
is_in(${searchRequest.value.osmData.lat}, ${searchRequest.value.osmData.lon})->.a;
rel(pivot.a)[place~"^(city|town|village|hamlet|locality)$"];
out body;`

  await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.elements.length === 0) {
        console.log('No results found')
        return false
      }
      const settlement = data.elements[0]
      let country = settlement.tags?.['addr:country'] ?? ''
      country = country === 'RU' ? 'Россия' : 'Забугорье'
      const region = settlement.tags?.['addr:region'] ?? ''
      const district = settlement.tags?.['addr:district'] ?? ''
      const name = settlement.tags?.['name'] ?? ''
      searchRequest.value!.settlement = {
        id: settlement.id,
        name: name,
        region: region,
        country: country,
        district: district,
      }
      console.log(settlement)
    })
  return true
}

const closeDialog = () => {
  emit('update:modelValue', false)
  if (map.value) {
    map.value.remove()
    map.value = null
    marker.value = null
  }
}

// Очистка при размонтировании компонента
onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
  }
})

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      // Используем nextTick для гарантии, что DOM обновлен
      nextTick(() => {
        initMap()
      })
    }
  },
  { immediate: true },
)
</script>
