<template>
  <div class="bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
    <h2 class="font-display text-display-sm uppercase font-semibold mb-4" :class="{
      'text-center': noTokens,
    }">tokens</h2>
    <template v-if="!noTokens">
      <div class="flex justify-between items-center mb-4">
        <div class="flex justify-between gap-x-2">
          <CTA v-if="hasERC721" :color="activeFilter === 'ERC-721' ? 'black' : 'gray'" size="sm" class="uppercase"
            @click="handleActiveFilter('ERC-721')">erc-721
          </CTA>
          <CTA v-if="hasERC721Edition" :color="activeFilter === 'ERC-721-EDITION' ? 'black' : 'gray'" size="sm"
            class="uppercase" @click="handleActiveFilter('ERC-721-EDITION')">erc-721-edition
          </CTA>
        </div>
        <!-- <div class="flex justify-between gap-x-2">
          <CTA color="gray" size="sm" class="uppercase">published</CTA>
          <CTA color="gray" size="sm" class="uppercase">drafts</CTA>
        </div> -->
      </div>
      <ul class="grid grid-cols-4 gap-4">
        <li v-for="(tokenCard, index) in visibleTokens" :key="`token-card-${index}`">
          <TokenCard :name="tokenCard.name" :description="tokenCard.description" :image="tokenCard.image"
            :type="tokenCard.type ?? '-'" />
        </li>
      </ul>
    </template>
    <p v-else class="text-center text-gray-400">You haven't minted any token yet</p>
  </div>
</template>

<script>
export default {
  props: {
    tokenCards: {
      type: [Array, null],
      default: null
    },
  },
  data() {
    return {
      activeFilter: null,
    }
  },
  computed: {
    hasERC721() {
      return this.tokenCards && this.tokenCards.filter(t => t.type === 'ERC-721').length
    },
    hasERC721Edition() {
      return this.tokenCards && this.tokenCards.filter(t => t.type === 'ERC-721-EDITION').length
    },
    visibleTokens() {
      if (this.activeFilter) {
        return this.tokenCards && this.tokenCards.filter(t => t.type === this.activeFilter)
      }
      return this.tokenCards
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
