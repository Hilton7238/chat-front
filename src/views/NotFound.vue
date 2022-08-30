<template>
  <div>
    <img src="../assets/img/404.jpg">
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'NotFound',
})
export default class NotFound extends Vue {
}
</script>

<style scoped lang="scss">
div {
  text-align: center;
}

img {
  width: 500px;
}

@media screen and (max-width: 380px) {
  img {
    width: 300px;
  }
}

@media screen and (max-width: 500px) {
  img {
    width: 350px;
  }
}
</style>
