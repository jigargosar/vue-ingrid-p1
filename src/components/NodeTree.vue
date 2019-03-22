<template>
  <div class="pl4">
    <div
      class="pa1 br2"
      :class="{ 'bg-blue white': selectedId === tree.id }"
    >
      {{ tree.title }}
      <!--<label><input type="text" v-model="tree.title"/></label>-->
    </div>
    <template v-for="child in tree.forest">
      <NodeTree :key="child.id" :tree="child" :selectedId="selectedId" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'NodeTree',
  props: {
    tree: Object,
    selectedId: String,
  },
}
</script>

<style scoped></style>
