<template>
  <div class="relative flex" @focusout="handleFocusOut">
    <CTA v-if="!isConnected" size="lg" :color="closeCTA.color" :icon="closeCTA.icon" @click="handleConnect()"
      class="uppercase">{{ closeCTA.label }}</CTA>
    <CTA v-else size="lg" :color="openCTA.color" @click="dropIsOpen = !this.dropIsOpen" :iconLeft="openCTA.icon">
      {{ openCTA.label }}</CTA>
    <div v-if="dropIsOpen && isConnected"
      class="absolute top-16 right-0 z-10 mt-2 w-56 border border-gray-900 rounded-lg ham-shadow">
      <ul class="flex flex-col bg-white rounded-md">
        <li class="border-b border-gray-900 last:border-none p-4">
          <p class="text-xs">Account</p>
          <p class="text-md font-bold text-gray-700">{{ truncate(this.wallet) }}</p>
        </li>
        <NuxtLink v-for="(option, index) in options" :key="`dropdown-option-${index}`" :to="option.route"
          class="flex gap-2 py-2.5 px-4 hover:bg-gray-100 border-b border-gray-900">
          <li class="flex gap-2">
            <Icon :icon="option.icon" height="5" width="5" />
            <p class="text-md text-gray-700">{{ option.label }}</p>
          </li>
        </NuxtLink>
        <li @click="handleDisconnect() && (dropIsOpen = !this.dropIsOpen)"
          class="flex gap-2 py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer">
          <Icon icon="log-out-01" height="5" width="5" />
          <p class="text-md text-gray-700">Log Out</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Ethereum from "@/components/Ethereum.vue";
export default {
  extends: Ethereum,
  props: {
    closeCTA: {
      type: Object,
      default: null
    },
    openCTA: {
      type: Object,
      default: null
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dropIsOpen: false,
    }
  },
  computed: {
    routePath() {
      return this.$route && this.$route.path
    }
  },
  watch: {
    routePath(newValue, oldValue) {
      if (newValue != oldValue) {
        if (this.dropIsOpen) {
          this.dropIsOpen = false
        }
      }
    }
  },
}
</script>