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
  methods: {
    handleUp(e) {
      console.log(`e`, e)
    },
    handleDown(e) {
      console.log(`e`, e)
    },
  },
}
</script>
