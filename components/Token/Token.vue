<template>
  <div class="w-full flex flex-col lg:flex-row gap-2 lg:gap-8">
    <div
      class="w-full aspect-square lg:min-w-[400px] lg:max-w-[400px] lg:h-[400px] rounded-lg overflow-hidden bg-slate-400">
      <img v-if="image" class="h-full w-full object-cover" :src="image" />
    </div>
    <ul class="text-left flex flex-col justify-center gap-2 lg:gap-3">
      <li v-if="createdBy">
        <span class="font-semibold">Created by</span>
        <span class="ml-2">{{ createdBy }}</span>
      </li>
      <li>
        <p class="font-display text-lg uppercase lg:text-display-sm font-semibold">{{ name }}</p>
      </li>
      <li>
        <p class="text-sm lg:text-md">Token ID: <span class="font-semibold">{{ tokenId }}</span></p>
      </li>
      <li>
        <p class="line-clamp-3 text-sm lg:text-md text-gray-500">{{ description }}</p>
      </li>
      <li class="hidden lg:visible">
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
      type: [Number, String, null],
      default: null
    },
  },
}
</script>
