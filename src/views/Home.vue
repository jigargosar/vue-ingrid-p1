<template>
  <div
    class="tl code"
    @keydown.up.prevent="handleUp"
    @keydown.down.prevent="handleDown"
    tabindex="0"
  >
    <NodeTree :tree="root" :selectedId="selectedId" />
  </div>
</template>

<script>
// @ is an alias to /src

import NodeTree from '../components/NodeTree'
import * as nanoid from 'nanoid'
import faker from 'faker'

function nn() {
  return {
    id: `id_${nanoid()}`,
    title: faker.name.lastName(),
    forest: [],
  }
}

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
  computed: {
    flatIds: function() {
      return Array.from(
        this.$el.querySelectorAll('[data-arrow-nav-id]'),
      ).map(x => x.dataset.arrowNavId)
    },
    selectedIdx: function() {
      return this.flatIds.findIndex(id => id === this.$data.selectedId)
    },
  },
  methods: {
    focusSelected() {
      const focusableEl = this.$el.querySelector(
        `[data-arrow-nav-id="${this.$data.selectedId}"]`,
      )
      if (focusableEl) {
        focusableEl.focus()
      }
    },
    handleUp() {
      const flatIds = this.flatIds
      const selIdx = this.selectedIdx

      const newIdx = selIdx - 1
      if (newIdx >= 0) {
        this.$data.selectedId = flatIds[newIdx]
      }
      this.focusSelected()
    },
    handleDown() {
      const flatIds = this.flatIds
      const selIdx = this.selectedIdx

      const newIdx = selIdx + 1
      if (newIdx < flatIds.length) {
        this.$data.selectedId = flatIds[newIdx]
      }
      this.focusSelected()
    },
  },
}
</script>
