<template>
  <router-view v-slot="{ Component }">
    <transition name="scale" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<style>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}


.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
<script>
import Index from "@/views/Index";
import ChatView from "@/views/ChatView";
import PopWindow from "@/components/PopWindow";
import ChangeUserInf from "@/views/ChangeUserInf";
import ChangePassword from "@/views/ChangePassword";
import Admin from "@/views/Admin";
import Modal from "@/components/global/modal/Modal";

export default {
  methods: {
    click() {
      this.$showModal({
        title: "test",
        msg: "miss"
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {Modal, Admin, ChangePassword, ChangeUserInf, PopWindow, ChatView, Index}
}
</script>
