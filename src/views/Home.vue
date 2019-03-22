<template>
  <div class="tl">
    {{ title }}
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
