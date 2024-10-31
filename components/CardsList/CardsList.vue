<template>
  <div class="">
    <h2 class="font-display text-display-sm uppercase font-semibold mb-4 pt-6 pl-6">{{ title }}</h2>
    <p v-if="isFetching"
      class="flex gap-2 mx-4 lg:mx-6 p-12 items-center justify-center border border-gray-900 rounded-xl bg-gray-100">
      <span>Fetching Tokens</span>
      <Icon icon="refresh-cw-03" class="animate-spin" />
    </p>
    <template v-else>
      <p v-if="noTokens" class="text-center text-gray-400">You haven't minted any token yet</p>
      <template v-else>
        <div class="flex justify-between items-center mb-4 pl-6">
          <ul class="flex justify-between gap-x-2">
            <li v-for="filter in filters" :key="`filter-${filter}`">
              <CTA :color="activeFilter === filter ? 'black' : 'gray'" @click="handleActiveFilter(filter)">{{
                filter }}
              </CTA>
            </li>
          </ul>
        </div>
        <ul class="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1 px-6 max-h-[1000px] overflow-auto">
          <li v-for="(card, index) in visibleTokens" :key="`token-card-${index}`" @click="$emit('view', { index })">
            <Card class="ham-shadow cursor-pointer" v-bind="card" />
          </li>
        </ul>
      </template>
    </template>
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
        const visibleTokens = tokens.map(c => { return { ...c, badgeColor: c.type === 'ERC 721 EDITION' ? 'indigo' : 'success' } })
        this.setVisibleTokens(visibleTokens)
        return visibleTokens
      }
      this.setVisibleTokens(this.cards.map(c => { return { ...c, badgeColor: c.type === 'ERC 721 EDITION' ? 'indigo' : 'success' } }))
      return this.cards.map(c => { return { ...c, badgeColor: c.type === 'ERC 721 EDITION' ? 'indigo' : 'success' } })
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
