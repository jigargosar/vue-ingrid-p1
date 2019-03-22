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
      />
    </template>
  </div>
</template>

<script>
import { nn } from '../tree-helpers'

export default {
  name: 'NodeTree',
  props: {
    parent: Object,
    tree: Object,
    selectedId: String,
    setSelectedOnFocus: Function,
  },
  methods: {
    handleEnter() {
      let newTree = nn()
      if (this.parent) {
        let forest = this.parent.forest
        const idxOfTree = forest.findIndex(t => this.tree === t)

        forest.splice(idxOfTree + 1, 0, newTree)
      } else {
        // console.log(`this`, this)
        this.tree.forest.push(newTree)
      }
      this.setSelectedOnFocus(newTree.id)
    },
  },
}
</script>

<style scoped></style>
