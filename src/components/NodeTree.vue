<template>
  <div class="pl3">
    <div class="pv1">
      {{ title }}
    </div>
    <template v-for="tree in forest">
      <NodeTree
        :key="tree.title"
        :title="tree.title"
        :forest="tree.forest"
      />
    </template>
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
