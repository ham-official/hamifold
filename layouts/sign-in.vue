<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <slot v-if="isBiggerThanMobile" />
    <MobileWarning v-else />
    <Footer />
    <HandleUX />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      isBiggerThanMobile: "isBiggerThanMobile",
    }),
  },
};
</script>
