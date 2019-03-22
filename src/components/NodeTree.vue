<template>
  <div class="pl4">
    <div
      :class="['pa1 br2', { 'bg-blue white': selectedId === tree.id }]"
      :data-arrow-nav-id="tree.id"
      tabindex="0"
      @focus="actions.setSelectedOnFocus(tree.id)"
      @keydown.enter.exact.prevent="actions.addNew(tree, parent)"
      @keydown.tab.exact.prevent="actions.indent(tree, parent)"
      @keydown.tab.shift.exact.prevent="actions.outdent(tree, parent)"
    >
      {{ tree.title }}
      <!--<label><input type="text" v-model="tree.title"/></label>-->
    </div>
    <NodeTree
      v-for="child in tree.forest"
      :key="child.id"
      :tree="child"
      :selectedId="selectedId"
      :parent="tree"
      :actions="actions"
    />
  </div>
</template>

<script>
export default {
  name: 'NodeTree',
  props: {
    parent: Object,
    tree: Object,
    selectedId: String,
    actions: Object,
  },
  methods: {},
}
</script>

<style scoped></style>
