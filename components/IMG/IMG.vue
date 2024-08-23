<template>
  <img :src="image" alt="" @error="handleErrorLoadImage" @load="$emit('load')">
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleErrorLoadImage(ev) {
      ev.target.src = '/ham-404.svg'
    }
  },
}
</script>