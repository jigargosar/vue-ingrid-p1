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
      :actions="actions"
    />
  </div>
</template>

<script>
// @ is an alias to /src

import NodeTree from '../components/NodeTree'
import { newNode } from '../tree-helpers'

function createRoot() {
  const root = newNode()
  root.id = 'id_root'
  root.title = 'Root'
  root.forest.push(newNode())
  root.forest.push(newNode())
  root.forest.push(newNode())
  return root
}

export default {
  name: 'home',
  components: { NodeTree },
  data: () => ({
    selectedId: 'id_root',
    root: createRoot(),
  }),
  computed: {
    actions() {
      return {
        addNew: this.addNew,
        setSelectedOnFocus: this.setSelectedOnFocus,
      }
    },
  },
  mounted() {
    this.focusSelected()
  },
  methods: {
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
      this.selectedId = id
    },
    setSelectedOnKeyNav(id) {
      this.selectedId = id
      this.focusSelected()
    },
    setSelectedOnAdd(id) {
      this.selectedId = id
      this.$nextTick(this.focusSelected)
    },
    addNew(tree, parent) {
      let newTree = newNode()
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
