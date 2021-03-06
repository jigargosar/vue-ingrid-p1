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
import {
  addNewTree,
  canCollapseTree,
  canExpandTree,
  collapseTree,
  createRoot,
  expandTree,
  flattenVisibleTreeIds,
  indent,
  outdent,
  removeTree,
} from '../tree-helpers'
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
      return flattenVisibleTreeIds(this.root)
    },
    actions() {
      return {
        selectTreeOnFocus: this.selectTreeOnFocus,
        addNew: (ancestors, tree) => {
          let newTree = addNewTree(ancestors, tree)
          this.setSelectedIdAndFocusOnNextTick(newTree.id)
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
          this.focusSelectedOnNextTick()
        },
        remove: (ancestors, tree) => {
          const removeSuccess = removeTree(ancestors, tree)
          if (removeSuccess) {
            const newId =
              this.computeNullablePrevId() ||
              this.computeNullableNextId() ||
              this.root.id
            this.setSelectedIdAndFocusOnNextTick(newId)
          }
        },
        collapseOrGoUp: (ancestors, tree) => {
          const parent = last(ancestors)
          if (!parent) return

          if (canCollapseTree(tree)) {
            collapseTree(tree)
          } else {
            this.setSelectedIdAndFocusOnNextTick(parent.id)
          }
        },
        expandOrGoNext: (ancestors, tree) => {
          if (canExpandTree(tree)) {
            expandTree(tree)
          } else {
            this.goNext()
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
      return this.visibleFlatIds
    },
    selectedIdx: function() {
      return this.flatIds().findIndex(id => id === this.selectedId)
    },
    focusSelected() {
      const focusableEl = this.$el.querySelector(
        `[data-arrow-nav-id="${this.selectedId}"]`,
      )
      if (focusableEl) {
        focusableEl.focus()
      }
    },
    focusSelectedOnNextTick() {
      this.$nextTick(this.focusSelected)
    },
    maybeChangeSelectedId(newId) {
      if (newId && newId !== this.selectedId) {
        this.selectedId = newId
      }
      this.focusSelectedOnNextTick()
    },
    selectTreeOnFocus(tree) {
      this.selectedId = tree.id
    },
    setSelectedIdAndFocusOnNextTick(id) {
      this.selectedId = id
      this.focusSelectedOnNextTick()
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
      this.maybeChangeSelectedId(this.computeNullablePrevId())
    },
    goNext() {
      this.maybeChangeSelectedId(this.computeNullableNextId())
    },
    handleDown() {
      this.goNext()
    },
  },
}
</script>
