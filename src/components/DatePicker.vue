<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ props }">
      <v-text-field v-model="formattedDate" :label="label" readonly v-bind="props"></v-text-field>
    </template>

    <v-date-picker
      :hide-header="true"
      v-model="selectedDate"
      @update:modelValue="updateDate"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: [Date, String],
    },
    label: {
      type: String,
      default: 'Выберите дату',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const menu = ref(false)
    const selectedDate = ref(
      typeof props.modelValue === 'string' ? new Date(props.modelValue) : props.modelValue || '',
    )
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const formattedDate = computed(() => {
      return selectedDate.value ? dateFormatter.format(new Date(selectedDate.value)) : ''
    })

    const updateDate = (value: Date | string) => {
      selectedDate.value = value
      emit('update:modelValue', value)
      menu.value = false
    }

    return { menu, selectedDate, formattedDate, updateDate }
  },
})
</script>
