<template>
  <main class="container mx-auto">
    <AuthSignIn />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
definePageMeta({ layout: 'sign-in' })
export default {
  data() {
    return {
      prevRoute: null,
    }
  },
  computed: {
    ...mapGetters(['isConnected'])
  },
  beforeRouteEnter(to, from, next) {
    if (from) {
      next(vm => {
        if (vm.isConnected) {
          vm.prevRoute = from.path
          vm.$router.push(from.path)
        }
      })
    }
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