<!--Компонент поиска адреса с выпадающим списком -->

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type IMapPlace } from '@/interfaces/IMapPlace'

export default defineComponent({
  name: 'SearchAddressDropdown',
  props: {
    modelValue: {
      type: Object as PropType<IMapPlace>,
      default: () => ({}) as IMapPlace,
    },
    placeholder: {
      type: String,
      default: 'Введите адрес',
    },
  },
  data() {
    return {
      query: null as string | null,
      geocoderSearchResult: [] as Array<{ id: number; data: any }>,
      timer: -1,
      rules: {
        required: (value: string) => !!value || 'Поле обязательно для заполнения',
      },
    }
  },
  emits: {
    'update:modelValue'(addr: IMapPlace) {
      return addr != null
    },
  },
  watch: {
    modelValue: {
      handler(newVal) {
        if (newVal && newVal.osmData.display_name) {
          this.query = newVal.osmData.display_name
        }
      },
    },
  },
  methods: {
    async geocodeCallBack() {
      if (!this.query || this.query.length < 3) return

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.query)}&format=json&addressdetails=1&accept-language=ru&countrycodes=ru`,
        )
        const resultArray = await response.json()

        if (!resultArray?.length) {
          this.geocoderSearchResult = []
          return
        }

        this.geocoderSearchResult = resultArray.map((item: any, index: number) => ({
          id: index,
          data: item,
        }))
      } catch (error) {
        console.error('Ошибка геокодинга:', error)
        this.geocoderSearchResult = []
      }
    },
    handleSelection(item: any) {
      if (item && typeof item === 'object' && item.data) {
        const selectedAddress: IMapPlace = {
          osmData: item.data,
        }
        this.$emit('update:modelValue', selectedAddress)
      }
    },
    onkeyup() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(this.geocodeCallBack, 1000)
    },
  },
})
</script>

<template>
  <v-container class="no-padding" fluid>
    <v-combobox
      v-model="query"
      :items="geocoderSearchResult"
      :filter="() => true"
      item-title="data.display_name"
      item-value="data"
      :placeholder="placeholder"
      @update:search="onkeyup"
      @update:modelValue="handleSelection"
      :rules="[rules.required]"
      outlined
      dense
      required
      no-filter
      hide-no-data
      clearable
      return-object
      auto-select-first
      :menu-props="{
        maxHeight: 300,
        contentClass: 'address-dropdown-menu',
      }"
    >
      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="item.raw.data.display_name"
          :subtitle="item.raw.data.address?.road || ''"
        ></v-list-item>
      </template>
    </v-combobox>
  </v-container>
</template>

<style scoped>
.no-padding {
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.address-dropdown-menu) {
  z-index: 1000 !important;
}
</style>
