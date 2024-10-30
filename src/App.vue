<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
export default {
  name: 'App',
  components: {AppFooter, AppHeader},
};
</script>
<template>
  <div class="wrapper">
    <AppHeader></AppHeader>
    <AppFooter></AppFooter>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}
header {
  background-color: #f8f9fa;
  padding: 20px;
}
nav a {
  margin: 0 15px;
}
.intro {
  margin: 20px;
}
footer {
  margin-top: 20px;
}

</style>
