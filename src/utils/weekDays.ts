export const weekDays = [
  { label: 'Пн', value: 1 << 0 },
  { label: 'Вт', value: 1 << 1 },
  { label: 'Ср', value: 1 << 2 },
  { label: 'Чт', value: 1 << 3 },
  { label: 'Пт', value: 1 << 4 },
  { label: 'Сб', value: 1 << 5 },
  { label: 'Вс', value: 1 << 6 },
]

export const getDaysOfWeekString = (daysOfWeek: number): string => {
  return weekDays
    .filter((day) => daysOfWeek & day.value)
    .map((day) => day.label)
    .join(', ')
}
