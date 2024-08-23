<template>
  <main class="relative">
    <section class="container mx-auto">
      <AuthSignIn />
    </section>
  </main>
</template>
<script>
import { mapGetters } from 'vuex';
definePageMeta({
  layout: 'sign-in'
})
export default {
  computed: {
    ...mapGetters(['isConnected']),
  },

  watch: {
    isConnected(newValue) {
      if (newValue) {
        this.$router.push('/home')
      }
    }
  },
}

</script>