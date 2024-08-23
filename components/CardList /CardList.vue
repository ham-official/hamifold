<template>
  <div class="bg-white border border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
    <h2 class="font-display text-display-sm uppercase font-semibold mb-4">contracts</h2>
    <section>
      <ul v-if="cards" class="grid grid-cols-4 gap-4">
        <li v-for="(card, index) in cards" :key="`contract-card-${index}`"
          class="h-full border hover:border-2 border-gray-900 p-4 ham-shadow rounded-lg overflow-hidden">
          <p class="text-gray-900 font-semibold">{{ card.contractAddress }}</p>
          <p class="text-gray-500 mb-3">{{ card.name }}</p>
          <div class="flex justify-between items-center">
            <Badge color="primary" size="sm" label="ERC721" />
            <p>{{ card.symbol }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    cards: {
      type: Array,
      default: [
        {
          name: 'Token 1',
          description: 'Token 1 description',
          image: 'https://picsum.photos/200/300',
          type: 'ERC 721',
        },
        {
          name: 'Token 2',
          description: 'Token 2 description',
          image: 'https://picsum.photos/200/300',
          type: 'ERC 721',
        }
      ]
    },
  },
}
</script>
