<template>
  <div class="pl3">
    <div class="pv1">
      {{ tree.title }}
      <!--<label><input type="text" v-model="tree.title"/></label>-->
    </div>
    <template v-for="child in tree.forest">
      <NodeTree :key="child.id" :tree="child" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'NodeTree',
  props: {
    tree: Object,
  },
}
</script>

<style scoped></style>
