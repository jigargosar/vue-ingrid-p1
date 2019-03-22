<template>
  <div
    class="tl code pr2"
    @keydown.up.prevent="handleUp"
    @keydown.down.prevent="handleDown"
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
import { createRoot, newNode } from '../tree-helpers'
import { compose, defaultTo, dropLast, last, mergeDeepRight } from 'ramda'
import { getCached, setCache } from '../cache-helpers'

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
        addNew: this.addNew,
        setSelectedOnFocus: this.setSelectedOnFocus,
        indent: (tree, ancestors) => {
          const parent = last(ancestors)
          if (parent) {
            const idx = parent.forest.indexOf(tree)
            const prevSib = parent.forest[idx - 1]
            if (prevSib) {
              parent.forest.splice(idx, 1)
              prevSib.forest.push(tree)
              this.$nextTick(this.focusSelected)
            }
          }
        },
        outdent: (tree, ancestors) => {
          const parent = last(ancestors)
          const grandParent = last(dropLast(1, ancestors))

          if (parent && grandParent) {
            const oldIdx = parent.forest.indexOf(tree)
            parent.forest.splice(oldIdx, 1)

            const newIdx = grandParent.forest.indexOf(parent) + 1

            grandParent.forest.splice(newIdx, 0, tree)
            this.$nextTick(this.focusSelected)
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
