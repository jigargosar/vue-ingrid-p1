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
import { addNewTree, createRoot, indent, outdent } from '../tree-helpers'
import { compose, defaultTo, last, mergeDeepRight } from 'ramda'
import { getCached, setCache } from '../cache-helpers'

export default {
  name: 'home',
  components: { NodeTree },
  data: () => {
    let root = createRoot()
    return compose(
      mergeDeepRight({
        selectedId: root.id,
        root,
      }),
      defaultTo({}),
      getCached,
    )('vue-ingrid-ti')
  },

  computed: {
    visibleFlatIds() {
      const arr = []
      const reducer = node => {
        arr.push(node.id)
        node.forest.forEach(reducer)
      }
      reducer(this.root)
      return arr
    },
    actions() {
      return {
        setSelectedOnFocus: this.setSelectedOnFocus,
        addNew: (ancestors, tree) => {
          let newTree = addNewTree(ancestors, tree)
          this.setSelectedOnAdd(newTree.id)
        },
        indent: (ancestors, tree) => {
          indent(ancestors, tree)
          this.$nextTick(this.focusSelected)
        },
        outdent: (ancestors, tree) => {
          outdent(ancestors, tree)
          this.$nextTick(this.focusSelected)
        },
        moveUp: (parent, tree) => {
          if (!parent) return
          const idx = parent.forest.indexOf(tree)
          if (idx > 0) {
            parent.forest.splice(idx, 1)
            parent.forest.splice(idx - 1, 0, tree)
          }
        },
        moveDown: (parent, tree) => {
          if (!parent) return
          const idx = parent.forest.indexOf(tree)
          if (idx < parent.forest.length - 1) {
            parent.forest.splice(idx, 1)
            parent.forest.splice(idx + 1, 0, tree)
          }
          this.$nextTick(this.focusSelected)
        },
        remove: (ancestors, tree) => {
          const parent = last(ancestors)
          if (!parent) return

          const newId =
            this.computeNullablePrevId() ||
            this.computeNullableNextId() ||
            this.root.id

          const idx = parent.forest.indexOf(tree)
          parent.forest.splice(idx, 1)

          this.setSelectedOnAdd(newId)

          this.$nextTick(this.focusSelected)
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
      // let domFlatIds = Array.from(
      //   this.$el.querySelectorAll('[data-arrow-nav-id]'),
      // ).map(x => x.dataset.arrowNavId)
      // const computedFlatIds = this.computedFlatIds
      // console.log(
      //   `computedFlatIds`,
      //   computedFlatIds,
      //   equals(computedFlatIds, domFlatIds),
      // )
      return this.visibleFlatIds
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
    computeNullablePrevId: function() {
      const flatIds = this.flatIds()
      const selIdx = this.selectedIdx()

      const newIdx = selIdx - 1
      return newIdx >= 0 && newIdx < flatIds.length
        ? flatIds[newIdx]
        : null
    },
    computeNullableNextId: function() {
      const flatIds = this.flatIds()
      const selIdx = this.selectedIdx()

      const newIdx = selIdx + 1
      return newIdx >= 0 && newIdx < flatIds.length
        ? flatIds[newIdx]
        : null
    },
    handleUp() {
      let newId = this.computeNullablePrevId()

      if (newId) {
        this.setSelectedOnKeyNav(newId)
      }
      this.focusSelected()
    },
    handleDown() {
      let newId = this.computeNullableNextId()

      if (newId) {
        this.setSelectedOnKeyNav(newId)
      }
      this.focusSelected()
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
