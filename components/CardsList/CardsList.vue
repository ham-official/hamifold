<template>
  <div class="bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
    <h2 class="font-display text-display-sm uppercase font-semibold mb-4" :class="{
      'text-center': noTokens,
    }">{{ title }}</h2>
    <p v-if="isFetching" class="flex gap-2">
      <span>Fetching Tokens</span>
      <Icon icon="refresh-cw-03" class="animate-spin" />
    </p>
    <template v-if="!noTokens && !isFetching">
      <div class="flex justify-between items-center mb-4">
        <ul class="flex justify-between gap-x-2">
          <li v-for="filter in filters" :key="`filter-${filter}`">
            <CTA :color="activeFilter === filter ? 'black' : 'gray'" @click="handleActiveFilter(filter)">{{ filter }}
            </CTA>
          </li>
        </ul>
      </div>
      <ul class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <li v-for="(card, index) in visibleTokens" :key="`token-card-${index}`" @click="$emit('view', { index })">
          <Card class="ham-shadow cursor-pointer" v-bind="card" />
        </li>
      </ul>
    </template>
    <p v-else class="text-center text-gray-400">You haven't minted any token yet</p>
  </div>
</template>

<script>
export default {
  props: {
    cards: {
      type: [Array, null],
      default: null
    },
    title: {
      type: String,
      default: 'tokens'
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeFilter: null,
    }
  },
  computed: {
    filters() {
      return this.cards && new Set([...this.cards.map(c => c.type)])
    },
    visibleTokens() {
      if (this.activeFilter) {
        return this.cards && this.cards.filter(c => c.type === this.activeFilter)
      }
      return this.cards
    },
    noTokens() {
      return !this.visibleTokens || this.visibleTokens.length === 0
    }
  },
  methods: {
    handleActiveFilter(filter) {
      this.activeFilter = (this.activeFilter === filter) ? null : filter
    }
  },
}
</script>
