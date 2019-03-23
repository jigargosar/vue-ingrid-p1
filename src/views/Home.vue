<template>
  <div
    class="tl code pr2"
    @keydown.up.exact.prevent="handleUp"
    @keydown.down.exact.prevent="handleDown"
    tabindex="0"
  >
    <NodeTree
      :ancestors="[]"
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
import { createRoot, indent, newNode, outdent } from '../tree-helpers'
import { compose, defaultTo, mergeDeepRight } from 'ramda'
import { getCached, setCache } from '../cache-helpers'

function addNewTree(parent, tree) {
  let newTree = newNode()
  if (parent) {
    let forest = parent.forest
    const idxOfTree = forest.findIndex(t => tree === t)

    forest.splice(idxOfTree + 1, 0, newTree)
  } else {
    // console.log(`this`, this)
    tree.forest.push(newTree)
  }
  return newTree
}

export default {
  name: 'home',
  components: { NodeTree },
  data: () =>
    compose(
      mergeDeepRight({
        selectedId: 'id_root',
        root: createRoot(),
      }),
      defaultTo({}),
      getCached,
    )('vue-ingrid-ti'),

  computed: {
    actions() {
      return {
        addNew(parent, tree) {
          let newTree = addNewTree(parent, tree)
          this.setSelectedOnAdd(newTree.id)
        },
        setSelectedOnFocus: this.setSelectedOnFocus,
        indent: (ancestors, tree) => {
          indent(ancestors, tree)
          this.$nextTick(this.focusSelected)
        },
        outdent: (ancestors, tree) => {
          outdent(ancestors, tree)
          this.$nextTick(this.focusSelected)
        },
        moveUp(parent, tree) {
          const idx = parent.forest.indexOf(tree)
          if (idx > 0) {
            parent.forest.splice(idx, 1)
            parent.forest.splice(idx - 1, 0, tree)
          }
        },
      }
    },
  },
  mounted() {
    this.focusSelected()
    this.$watch(
      () => this.$data,
      () => setCache('vue-ingrid-ti', this.$data),
      { deep: true },
    )
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
  },
}
</script>
