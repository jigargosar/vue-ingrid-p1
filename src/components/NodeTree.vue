<template>
  <div>
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'NodeTree',
  props: {
    title: String,
    forest: Array,
  },
}
</script>

<style scoped></style>
