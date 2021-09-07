<template>
  <div id="app-container">
    <Header
      v-if="!gameStarted"
      @start-game="startGame"
      @show-high-scores="setShowHighScores(!showHighScores)"
    />
    <Canvas v-if="gameStarted" @stop-game="stopGame()" :userName="this.userName" :maxHighScores="this.maxHighScores" />
    <HighScores v-if="showHighScores" :maxHighScores="this.maxHighScores" />
  </div>
</template>

<script>
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import HighScores from "./components/HighScores";

export default {
  name: "App",
  components: {
    Header,
    Canvas,
    HighScores,
  },
  data() {
    return {
      gameStarted: false,
      showHighScores: false,
      userName: "Anonymous",
      maxHighScores: 10,
    };
  },
  methods: {
    startGame(userName) {
      this.gameStarted = true;
      this.setShowHighScores(false);
      if (userName.length > 0) {
        this.userName = userName;
      }
    },
    stopGame() {
      this.gameStarted = false;
    },
    setShowHighScores(show) {
      this.showHighScores = show;
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: black;
}

#app-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  width: 600px;
  min-height: 600px;
  max-height: 1200px;
  margin: auto;
  border: 3px solid green;
  padding: 25px;
  border-radius: 10px;
}
</style>
