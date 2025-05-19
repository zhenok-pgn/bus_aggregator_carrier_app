export class DateOnly {
  public value: string

  constructor(value?: string) {
    if (!value) {
      const today = new Date()
      this.value = today.toISOString().slice(0, 10) // "YYYY-MM-DD"
    } else {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Invalid DateOnly format')
      }
      this.value = value
    }
  }
  toString() {
    return this.value
  }
  toJSON() {
    return this.value
  }
}

export class TimeOnly {
  constructor(public value: string = '00:00') {
    if (!/^\d{2}:\d{2}$/.test(value)) {
      throw new Error('Invalid TimeOnly format')
    }
  }
  toString() {
    return this.value
  }
  toJSON() {
    return this.value
  }
}
