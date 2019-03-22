<template>
  <div class="tl">
    {{ title }}
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {},
  data: () => ({
    title: 'HW',
    root: { title: 'Root', forest: [{ title: 'Node 1' }] },
  }),
}
</script>
