<template>
  <div class="pl4">
    <div
      :class="['pa1 br2', { 'bg-blue white': selectedId === tree.id }]"
      :data-arrow-nav-id="tree.id"
      tabindex="0"
      @focus="setSelectedOnFocus(tree.id)"
      @keydown.enter.prevent="handleEnter"
    >
      {{ tree.title }}
      <!--<label><input type="text" v-model="tree.title"/></label>-->
    </div>
    <template v-for="child in tree.forest">
      <NodeTree
        :key="child.id"
        :tree="child"
        :selectedId="selectedId"
        :setSelectedOnFocus="setSelectedOnFocus"
        :parent="tree"
        :addNew="addNew"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'NodeTree',
  props: {
    parent: Object,
    tree: Object,
    selectedId: String,
    setSelectedOnFocus: Function,
    addNew: Function,
  },
  methods: {
    handleEnter() {
      this.addNew(this.tree, this.parent)
    },
  },
}
</script>

<style scoped></style>
