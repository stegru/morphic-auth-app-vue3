<template>
  <div>
    <label>{{label}}</label>
    <input type="text" />
  </div>
</template>

<style scoped lang="scss">
</style>

<script>
export default {
    name: "TextField",
    props: {
        label: String
    }
};
</script>

