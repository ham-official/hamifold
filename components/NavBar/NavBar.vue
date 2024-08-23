<template>
  <nav v-if="routes" class="flex items-center gap-4 py-6">
    <NuxtLink v-for="(r, index) in routes" :key="`route-${index}`" :to="r.path" class="text-lg text-gray-900 border-b" :class="{
    'border-transparent hover:border-gray-900': !currentPath.includes(r.path),
    'border-gray-900 cursor-not-allowed': currentPath.includes(r.path)
  }">{{ r.name }}
    </NuxtLink>
  </nav>
</template>

<script>
export default {
  props: {
    routes: {
      type: [Array, null],
      default: null
    },
  },
  computed: {
    currentPath() {
      return this.$router.currentRoute.value.path
    }
  },
}
</script>