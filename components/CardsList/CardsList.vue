<template>
  <div
    class="bg-transparent lg:bg-white border-b-2 lg:border-2 border-gray-900 ham-shadow--active--desktop pb-6 rounded-none lg:rounded-3xl text-gray-900 mt-0 lg:mt-6">
    <h2 class="font-display text-display-sm uppercase font-semibold mb-4 pt-6 pl-6" :class="{
      'text-center': noTokens,
    }">{{ title }}</h2>
    <p v-if="isFetching" class="flex gap-2">
      <span>Fetching Tokens</span>
      <Icon icon="refresh-cw-03" class="animate-spin" />
    </p>
    <template v-if="!noTokens && !isFetching">
      <div class="flex justify-between items-center mb-4 pl-6">
        <ul class="flex justify-between gap-x-2">
          <li v-for="filter in filters" :key="`filter-${filter}`">
            <CTA :color="activeFilter === filter ? 'black' : 'gray'" @click="handleActiveFilter(filter)">{{
              filter }}
            </CTA>
          </li>
        </ul>
      </div>
      <ul class="flex overflow-x-auto lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1 px-6">
        <li v-for="(card, index) in visibleTokens" :key="`token-card-${index}`" @click="$emit('view', { index })">
          <Card class="ham-shadow cursor-pointer" v-bind="card" />
        </li>
      </ul>
    </template>
    <p v-else class="text-center text-gray-400">You haven't minted any token yet</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
        const tokens = this.cards && this.cards.filter(c => c.type === this.activeFilter)
        this.setVisibleTokens(tokens)
        return tokens
      }
      this.setVisibleTokens(this.cards)
      return this.cards
    },
    noTokens() {
      return !this.visibleTokens || this.visibleTokens.length === 0
    }
  },
  methods: {
    ...mapActions(['setVisibleTokens']),
    handleActiveFilter(filter) {
      this.activeFilter = (this.activeFilter === filter) ? null : filter
      this.setVisibleTokens(this.visibleTokens)
    }
  },
}
</script>
