<template>
  <div class="pl3">
    <div class="pv1">
      {{ title }}
    </div>
    <template v-for="tree in forest">
      <NodeTree
        :key="tree.id"
        :title="tree.title"
        :forest="tree.forest"
        :tree="tree"
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
    tree: Object,
  },
}
</script>

<style scoped></style>
