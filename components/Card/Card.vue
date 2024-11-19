<template>
  <div
    class="flex flex-col h-full border-2 hover:border-2 bg-white border-gray-900 rounded-lg overflow-hidden min-w-[224px] xs-only:max-w-[224px]">
    <div class="w-full aspect-square border-b border-gray-950 overflow-hidden">
      <IMG :image="image" class="h-full w-full object-cover" />
    </div>
    <div class="p-4 flex flex-col flex-1">
      <p class="text-md font-semibold">{{ name }}</p>
      <p class="text-md text-gray-500 line-clamp-2 mb-3">{{ description }}</p>
      <Badge v-if="type" class="mt-auto" :color="badgeColor" size="sm" :label="type" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'name'
    },
    description: {
      type: String,
      default: 'description'
    },
    image: {
      type: String,
      default: 'image'
    },
    type: {
      type: [String, null],
      default: null
    },
    badgeColor: {
      type: String,
      default: 'primary'
    }
  },
}
</script>