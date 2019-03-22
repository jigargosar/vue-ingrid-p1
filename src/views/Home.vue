<template>
  <div class="tl code">
    <NodeTree :title="root.title" :forest="root.forest" :tree="root" />
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
    selectedId: 'HW',
    root: cr(),
  }),
}
</script>
