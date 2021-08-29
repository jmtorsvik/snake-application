<template>
  <div style="text-align: center">
    <h1>Snake Game</h1>
    <Canvas />
  </div>
</template>

<script>
import Canvas from "./components/Canvas";

export default {
  name: "App",
  components: {
    Canvas,
  },
};
</script>
