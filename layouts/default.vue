<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <template v-if="isBiggerThanMobile">
      <Header />
      <slot />
    </template>
    <MobileWarning v-else />
    <Footer />
    <HandleUX />
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      isBiggerThanMobile: "isBiggerThanMobile",
    }),
  },
};
</script>
