<template>
  <section
    class="bg-transparent sm:bg-white  sm:border-2 border-gray-900 ham-shadow--active--desktop rounded-none sm:rounded-3xl text-gray-900 mt-0 sm:mt-6 pb-6"
    :class="{
      'border-b-2': hasBorderBottomInMobile
    }">
    <h3 class="font-display font-semibold text-display-sm pt-6 pl-4 sm:px-6 uppercase mb-4">
      {{ title }}
    </h3>
    <p v-if="isFetching"
      class="flex gap-2 mx-4 sm:mx-6 p-12 items-center justify-center border border-gray-900 rounded-xl bg-gray-200">
      <span>{{ fetchingText }}</span>
      <Icon icon="refresh-cw-03" class="animate-spin" />
    </p>
    <template v-else>
      <div v-if="isEmpty" class="mx-4 sm:mx-6 border border-gray-900 bg-gray-200 rounded-2xl py-36 px-8">
        <slot name="empty">
        </slot>
      </div>
      <template v-else>
        <p v-if="contentSubtitle" class="font-semibold pl-4 sm:px-6 mb-2">{{ contentSubtitle }}</p>
        <ul
          class="flex gap-4 pl-4 sm:px-6 pt-1 max-h-[1000px] overflow-auto sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <li v-for="card, i in cards" :key="`${name}-${i}`">
            <template v-if="listItemIsLink">
              <NuxtLink :to="`/c/${card.url}`">
                <Card class="ham-shadow cursor-pointer" v-bind="card" />
              </NuxtLink>
            </template>
            <template v-else>
              <Card class="ham-shadow cursor-pointer" v-bind="card" @click="handleClick(i)" />
            </template>
          </li>
        </ul>
      </template>
    </template>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  props: {
    title: {
      type: [String, null],
      default: null
    },
    name: {
      type: String,
      default: 'name'
    },
    contentSubtitle: {
      type: [String, null],
      default: null
    },
    list: {
      type: [Array, null],
      default: null
    },
    listItemIsLink: {
      type: Boolean,
      default: true
    },
    hasBorderBottomInMobile: {
      type: Boolean,
      default: true
    },
    isFetching: {
      type: Boolean,
      default: true,
    },
    fetchingText: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['isDesktop', 'currentTokenIndex', 'modalData', 'slideOverData']),
    isEmpty() {
      return !this.list || this.list.length === 0
    },
    cards() {
      return this.list && this.list.map(item => { delete item.metadata.attributes; return item.metadata })
    },
    numberOfCards() {
      return (this.cards && this.cards.length) ?? 0
    }
  },
  watch: {
    currentTokenIndex(newValue, oldValue) {
      if (oldValue === 0 && newValue === -1 && (this.slideOverData || this.modalData)) {
        // Prev has been pressed on first element
        const newIndex = this.numberOfCards - 1
        this.setCurrentTokenIndex(newIndex)
        this.handleClick(newIndex)
      }
      if (newValue === this.numberOfCards && !this.listItemIsLink) {
        // Next has been pressed on last element
        const newIndex = 0
        this.setCurrentTokenIndex(newIndex)
      }
      if (!this.listItemIsLink && oldValue !== -1 && newValue !== oldValue) {
        // Element is not a link and it has been pressed
        this.handleClick(newValue)
      }
    }
  },
  methods: {
    ...mapActions(['setCurrentTokenIndex', 'setModalData', 'setShowGeneralModal', 'setSlideOverData', 'setShowSlideOver']),
    handleClick(index) {
      const card = this.cards[index]
      if (card) {
        const UXData = { title: 'token', components: ['Token'], data: card }
        if (this.isDesktop) {
          this.setModalData(UXData);
          this.setShowGeneralModal(true);
        } else {
          this.setSlideOverData(UXData);
          this.setShowSlideOver(true);
        }
        if (this.currentTokenIndex !== index) {
          this.setCurrentTokenIndex(index);
        }
      }
    },

  },
}
</script>