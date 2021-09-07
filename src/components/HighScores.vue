<template>
  <h2>High Scores</h2>
  <div class="listContainer">
    <p></p>
    <p><b>Name</b></p>
    <p><b>Score</b></p>
  </div>
  <div class="listContainer">
    <ol>
      <li v-for="score in highScores" :key="score"></li>
    </ol>
    <ol class="highScoreList">
      <li v-for="score in highScores" :key="score">
        {{ score[0] }}
      </li>
    </ol>
    <ol class="highScoreList">
      <li v-for="score in highScores" :key="score">
        {{ score[1] }}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: "HighScores",
  props: {
    maxHighScores: Number,
  },
  data() {
    return {
      highScores: [],
    };
  },
  methods: {
    async fetchHighScores() {
      const res = await fetch("http://10.0.0.8:8081/scores").catch((error) => {
        console.log(error);
      });

      const highScoresJSON = await res.json();

      for (let i = 0; i < this.maxHighScores; i++) {
        this.highScores.push(["", 0]);
      }

      // Iterate over each entry in json data
      highScoresJSON.forEach((user) => {
        // Iterate over each user score
        for (let i = 0; i < user.scores.length; i++) {
          let score = user.scores[i]
          let gotInserted = false;
          // Iterate over each high score
          for (let j = 0; j < this.maxHighScores; j++) {
            if (score > this.highScores[j][1]) {
              this.highScores.splice(j, 0, [user.name, score]);
              this.highScores.pop();
              gotInserted = true;
              break;
            }
          }
          // Break loop if score didnt get inserted into highScores
          if (!gotInserted) {
            break;
          }
        }
      });
    },
  },
  created() {
    this.fetchHighScores();
  },
};
</script>

<style scoped>
* {
  color: white;
}

h2 {
  text-align: left;
}

ol,
p {
  text-align: right;
}

.listContainer {
  display: flex;
  justify-content: space-between;
}

.highScoreList {
  list-style-type: none;
}
</style>
