<template>
  <div
    class="tl code pr2"
    @keydown.up.prevent="handleUp"
    @keydown.down.prevent="handleDown"
    tabindex="0"
  >
    <NodeTree
      :parent="null"
      :tree="root"
      :selectedId="selectedId"
      :setSelectedOnFocus="setSelectedOnFocus"
      :addNew="addNew"
      :actions="actions"
    />
  </div>
</template>

<script>
// @ is an alias to /src

import NodeTree from '../components/NodeTree'
import { nn } from '../tree-helpers'

function cr() {
  const root = nn()
  root.id = 'id_root'
  root.title = 'Root'
  root.forest.push(nn())
  root.forest.push(nn())
  root.forest.push(nn())
  return root
}

export default {
  name: 'home',
  components: { NodeTree },
  data: () => ({
    selectedId: 'id_root',
    root: cr(),
  }),
  computed: {},
  methods: {
    actions() {
      return {
        addNew: this.addNew.bind(this),
        setSelectedOnFocus: this.setSelectedOnFocus.bind(this),
      }
    },
    flatIds: function() {
      return Array.from(
        this.$el.querySelectorAll('[data-arrow-nav-id]'),
      ).map(x => x.dataset.arrowNavId)
    },
    selectedIdx: function() {
      return this.flatIds().findIndex(id => id === this.$data.selectedId)
    },
    focusSelected() {
      const focusableEl = this.$el.querySelector(
        `[data-arrow-nav-id="${this.$data.selectedId}"]`,
      )
      if (focusableEl) {
        focusableEl.focus()
      }
    },
    handleUp() {
      const flatIds = this.flatIds()
      const selIdx = this.selectedIdx()

      const newIdx = selIdx - 1
      if (newIdx >= 0) {
        this.setSelectedOnKeyNav(flatIds[newIdx])
      }
      this.focusSelected()
    },
    handleDown() {
      const flatIds = this.flatIds()
      const selIdx = this.selectedIdx()

      const newIdx = selIdx + 1
      if (newIdx < flatIds.length) {
        this.setSelectedOnKeyNav(flatIds[newIdx])
      }
    },
    setSelectedOnFocus(id) {
      this.$data.selectedId = id
      // this.focusSelected()
    },
    setSelectedOnKeyNav(id) {
      this.$data.selectedId = id
      this.focusSelected()
    },
    setSelectedOnAdd(id) {
      this.$data.selectedId = id
      this.$nextTick(() => this.focusSelected())
    },
    addNew(tree, parent) {
      let newTree = nn()
      if (parent) {
        let forest = parent.forest
        const idxOfTree = forest.findIndex(t => tree === t)

        forest.splice(idxOfTree + 1, 0, newTree)
      } else {
        // console.log(`this`, this)
        tree.forest.push(newTree)
      }
      this.setSelectedOnAdd(newTree.id)
    },
  },
}
</script>
