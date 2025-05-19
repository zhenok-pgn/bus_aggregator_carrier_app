<template>
  <v-row>
    <v-col cols="12">
      <v-card class="pa-4" elevation="2">
        <v-card-title>Сегменты маршрута</v-card-title>

        <v-divider class="mb-4" />

        <v-row
          v-for="segment in routeStore.route.routeSchedules[0].routeSegmentSchedules"
          :key="segment.segmentNumber"
          class="mb-4"
        >
          <v-col cols="12">
            <v-card variant="outlined" class="pa-3">
              <v-row>
                <v-col cols="12" md="8">
                  <strong
                    >{{
                      `${segment.routeSegment.from.locality.name}${segment.routeSegment.from.name ? ',' + segment.routeSegment.from.name : ''}`
                    }}
                    →
                    {{
                      `${segment.routeSegment.to.locality.name}${segment.routeSegment.to.name ? ',' + segment.routeSegment.to.name : ''}`
                    }}</strong
                  >
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="segment.price"
                    label="Цена (₽)"
                    type="number"
                    min="0"
                    density="compact"
                    @blur="onPriceBlur(segment.price, segment.segmentNumber)"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRouteStore } from '../stores/routes'

const routeStore = useRouteStore()

const onPriceBlur = (price: number, segmentNumber: string) => {
  routeStore.updateSegmentPrices(price, segmentNumber)
}
</script>
