<template>
  <div>
    <h1>Snake Game</h1>
    <div>
      <input type="text" v-model="userName" placeholder="Username" />
      <button @click="$emit('start-game', userName)">Start Game</button>
      <button @click="$emit('show-high-scores')">High Scores</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      userName: "",
    }
  }
};
</script>

<style scoped>
* {
  margin-top: 10px;
  margin-bottom: 10px;
}

h1 {
  color: white;
}

button,
input {
  margin-left: 20px;
  margin-right: 20px;
  width: 120px;
  height: 40px;
  text-align: center;
  font-size: 16px;
}

</style>
