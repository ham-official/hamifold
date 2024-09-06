<template>
  <div class="flex flex-col h-full border-2 hover:border-2 border-gray-900 rounded-lg overflow-hidden">
    <div class="h-[224px] border-b border-gray-950">
      <IMG :image="image" class="h-full w-full object-cover" />
    </div>
    <div class="p-4 flex flex-col flex-1">
      <p class="text-md font-semibold">{{ name }}</p>
      <p class="text-md text-gray-500 line-clamp-2 mb-3">{{ description }}</p>
      <Badge class="mt-auto" color="primary" size="sm" :label="type" />
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
      type: String,
      default: 'type'
    }
  },
}
</script>

<style lang="scss" scoped></style>