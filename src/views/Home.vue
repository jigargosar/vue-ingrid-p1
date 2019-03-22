<template>
  <div class="tl code">
    <NodeTree :title="root.title" :forest="root.forest" />
  </div>
</template>

<script>
// @ is an alias to /src

import NodeTree from '../components/NodeTree'

export default {
  name: 'home',
  components: { NodeTree },
  data: () => ({
    title: 'HW',
    root: { title: 'Root', forest: [{ title: 'Node 1' }] },
  }),
}
</script>
