<template>
  <div class="w-full flex gap-8">
    <div class="w-[400px] h-[400px] object-cover rounded-lg overflow-hidden bg-slate-400">
      <img v-if="image" class="h-full w-full" :src="image" />
    </div>
    <ul class="text-left flex flex-col justify-center gap-4">
      <li v-if="createdBy">
        <span class="font-semibold">Created by</span>
        <span class="ml-2">{{ createdBy }}</span>
      </li>
      <li>
        <p class="font-display text-display-sm font-semibold">{{ name }}</p>
      </li>
      <li>
        <p class="font-semibold">Token Id</p>
        <p class="text-gray-500">{{ tokenId }}</p>
      </li>
      <li>
        <p class="font-semibold">Description</p>
        <p class="line-clamp-3 text-gray-500">{{ description }}</p>
      </li>
      <li>
        <Badge color="primary" size="sm" :label="type"></Badge>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    createdBy: {
      type: [String, null],
      default: null
    },
    description: {
      type: [String, null],
      default: null
    },
    image: {
      type: [String, null],
      default: null
    },
    imageDetails: {
      type: [Object, null],
      default: null
    },
    name: {
      type: [String, null],
      default: null
    },
    type: {
      type: [String, null],
      default: null
    },
    tokenId: {
      type: [Number, null],
      default: null
    },
  },
}
</script>
