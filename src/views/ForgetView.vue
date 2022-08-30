<template>
  <div class="bg">
    <forget class="forget" @goLogin="goLogin"></forget>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Forget from '@/components/Forget.vue';

@Options({
  name: 'ForgetView',
  components: {Forget},
  methods: {
    goLogin() {
      this.$router.push('/chat/index');
    }
  },
  mounted() {
    setTimeout(() => {
      document.getElementsByClassName('forget')[0].classList.add('show');
    }, 0);
  }
})
export default class ForgetView extends Vue {
}
</script>

<style scoped lang="scss">
.bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}

.type {
  position: absolute;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
  font-size: 25px;
  font-weight: 800;
  color: #376b5d;
}

.forget {
  position: absolute;
  transition: all 0.6s cubic-bezier(0.2, 0.4, 0.8, 1);
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
}

.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

@media screen and (max-width: 400px) {
  .type {
    font-size: 16px;
  }
}

@media screen and (max-width: 500px) and (min-width: 400px) {
  .type {
    font-size: 18px;
  }
}
</style>
