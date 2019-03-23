<template>
  <div class="pl4">
    <div
      :class="['pa1 br2', { 'bg-blue white': selectedId === tree.id }]"
      :data-arrow-nav-id="tree.id"
      tabindex="0"
      @focus="actions.setSelectedOnFocus(tree.id)"
      @keydown.enter.exact.prevent="actions.addNew(parent, tree)"
      @keydown.tab.exact.prevent="actions.indent(ancestors, tree)"
      @keydown.tab.shift.exact.prevent="actions.outdent(ancestors, tree)"
      @keydown.up.meta.exact.prevent="actions.moveUp(parent, tree)"
    >
      {{ tree.title }}
      <!--<label><input type="text" v-model="tree.title"/></label>-->
    </div>
    <NodeTree
      v-for="child in tree.forest"
      :key="child.id"
      :ancestors="[...ancestors, tree]"
      :parent="tree"
      :tree="child"
      :selectedId="selectedId"
      :actions="actions"
    />
  </div>
</template>

<script>
export default {
  name: 'NodeTree',
  props: {
    ancestors: Array,
    parent: Object,
    tree: Object,
    selectedId: String,
    actions: Object,
  },
  methods: {},
}
</script>

<style scoped></style>
