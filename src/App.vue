<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <pre>a{{$options}}</pre>
</template>

<script>
import HelloWorld from "./components/TextField.vue";

export default {
    name: "App",
    components: {
        HelloWorld
    },
    data() {
        return {

        };
    },
    mounted() {
        console.log(this.$route);
    }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
