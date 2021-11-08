<template>
  <h1>LOGIN</h1>

  <TextField label="login"/>
  <TextField label="password"/>

</template>

<style scoped lang="scss">

</style>

<script>
import TextField from "@/components/TextField.vue";

export default {
    name: "login",
    components: { TextField }
};
</script>
