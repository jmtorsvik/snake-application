<template>
  <div id="canvas"></div>
</template>

<script>
export default {
  name: "Canvas",
  props: {
    userName: String,
    maxHighScores: Number,
  },
  methods: {
    async addScore(score) {
      const res = await fetch("http://10.0.0.8:8081/scores");

      const data = await res.json();

      const userObject = data.filter((user) => user.name === this.userName)[0];

      if (userObject) {
        const scores = userObject.scores;
        
        for (let i = 0; i < scores.length; i++) {
          if (score > scores[i]) {
            scores.splice(i, 0, score);
            scores.pop();
            break;
          }
        }

        fetch(`http://10.0.0.8:8081/scores/${this.userName}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            scores: scores,
          }),
        });

      } else {
        fetch(`http://10.0.0.8:8081/scores/${this.userName}`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            scores: [score, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          }),
        });
      }
    },
  },
  mounted() {
    console.log(this.userName + " is now playing.");

    const script = (p5) => {
      const canvas = this;
      const canvasSize = 500;
      const side = 40;
      const vel = 4;
      let snake = [];
      let score = snake.length * 1000;
      let gameLost = false;
      let food = {
        x: -100,
        y: -100,
        s: side,
        show: function() {
          p5.rectMode(p5.CENTER);
          p5.noStroke();
          p5.fill(0, 255, 0);
          p5.rect(this.x, this.y, this.s, this.s);
        },
        tp: function() {
          this.x = p5.random(this.s / 2, p5.width - this.s / 2);
          this.y = p5.random(this.s / 2, p5.height - this.s / 2);
        },
      };

      function showScore() {
        p5.textSize(p5.height / 25);
        p5.fill(255, 255, 255, 100);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text("Score: " + score, p5.width / 200, p5.height / 200);
      }

      function selfCollide() {
        for (let i = 2; i < snake.length; i++) {
          if (
            p5.dist(snake[0].x, 0, snake[i].x, 0) <
              (snake[0].s + snake[i].s) / 2 &&
            p5.dist(0, snake[0].y, 0, snake[i].y) <
              (snake[0].s + snake[i].s) / 2
          ) {
            return true;
          }
        }
      }

      function gameLostScreen() {
        p5.background(0, 25, 50);
        let s = p5.height / 10;
        p5.textSize(s);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.BOTTOM);
        p5.textStyle(p5.ITALIC);
        let d = 1;
        p5.text("GAME", p5.width / 2, p5.height / 2 - d);
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.text("OVER", p5.width / 2, p5.height / 2 + d);
        p5.textSize(s / 1.5);
        p5.textStyle(p5.NORMAL);
        p5.text("Score: " + p5.int(score), p5.width / 2, p5.height / 1.5);
        p5.fill(0, 255, 0);
        p5.textSize(s / 2);
        p5.text("Press 'R' to Try Again", p5.width / 2, p5.height / 1.25);
        p5.text("Press 'M' to go to Menu", p5.width / 2, p5.height / 1.15);
        p5.text("Use 'WASD' to move", p5.width / 2, p5.height / 4.5);
      }

      function loseGame() {
        gameLost = true;

        // Add new score
        canvas.addScore(score);
      }

      function reset() {
        snake = [];
        p5.setup();
        gameLost = false;
      }

      p5.keyPressed = () => {
        if (
          p5.keyCode === 65 &&
          !snake[0].movingRight &&
          snake[0].x == snake[1].x
        ) {
          snake[0].movingLeft = true;
          snake[0].movingRight = false;
          snake[0].movingUp = false;
          snake[0].movingDown = false;
        } else if (
          p5.keyCode === 68 &&
          !snake[0].movingLeft &&
          snake[0].x == snake[1].x
        ) {
          snake[0].movingLeft = false;
          snake[0].movingRight = true;
          snake[0].movingUp = false;
          snake[0].movingDown = false;
        } else if (
          p5.keyCode === 87 &&
          !snake[0].movingDown &&
          snake[0].y == snake[1].y
        ) {
          snake[0].movingLeft = false;
          snake[0].movingRight = false;
          snake[0].movingUp = true;
          snake[0].movingDown = false;
        } else if (
          p5.keyCode === 83 &&
          !snake[0].movingUp &&
          snake[0].y == snake[1].y
        ) {
          snake[0].movingLeft = false;
          snake[0].movingRight = false;
          snake[0].movingUp = false;
          snake[0].movingDown = true;
        } else if (p5.keyCode === 82 && gameLost) {
          reset();
        } else if (p5.keyCode === 77 && gameLost) {
          canvas.$emit("stop-game");
        }
      };

      // SETUP
      p5.setup = () => {
        p5.createCanvas(canvasSize, canvasSize);

        let dx = 0;
        for (let i = 0; i < 2; i++) {
          snake[i] = new Cube(p5.width / 2 + dx, p5.height / 2);
          dx -= snake[i].offset;
        }

        food.tp();

        snake[0].movingRight = true;
      };

      // DRAW
      p5.draw = () => {
        if (gameLost) {
          gameLostScreen();
        } else {
          if (
            selfCollide() ||
            snake[0].x < snake[0].s / 2 ||
            snake[0].x > p5.width - snake[0].s / 2 ||
            snake[0].y < snake[0].s / 2 ||
            snake[0].y > p5.height - snake[0].s / 2
          ) {
            loseGame();
          } else {
            p5.background(0, 25, 50);

            if (snake[0].onFood()) {
              if (snake[snake.length - 1].movingLeft) {
                snake.push(
                  new Cube(
                    snake[snake.length - 1].x + snake[snake.length - 1].offset,
                    snake[snake.length - 1].y
                  )
                );
              } else if (snake[snake.length - 1].movingRight) {
                snake.push(
                  new Cube(
                    snake[snake.length - 1].x - snake[snake.length - 1].offset,
                    snake[snake.length - 1].y
                  )
                );
              } else if (snake[snake.length - 1].movingUp) {
                snake.push(
                  new Cube(
                    snake[snake.length - 1].x,
                    snake[snake.length - 1].y + snake[snake.length - 1].offset
                  )
                );
              } else if (snake[snake.length - 1].movingDown) {
                snake.push(
                  new Cube(
                    snake[snake.length - 1].x,
                    snake[snake.length - 1].y - snake[snake.length - 1].offset
                  )
                );
              }
              food.tp();
            }

            for (let cube of snake) {
              for (let cube of snake) {
                if (cube.onFood()) {
                  food.tp();
                }
              }
              cube.show();
            }

            food.show();

            if (snake[0].movingLeft) {
              snake[0].moveLeft();
            } else if (snake[0].movingRight) {
              snake[0].moveRight();
            } else if (snake[0].movingUp) {
              snake[0].moveUp();
            } else if (snake[0].movingDown) {
              snake[0].moveDown();
            }

            for (let i = 1; i < snake.length; i++) {
              if (
                (snake[i - 1].movingLeft && snake[i - 1].y == snake[i].y) ||
                (snake[i - 1].movingUp && snake[i - 1].x < snake[i].x) ||
                (snake[i - 1].movingDown && snake[i - 1].x < snake[i].x)
              ) {
                snake[i].moveLeft();
              } else if (
                (snake[i - 1].movingRight && snake[i - 1].y == snake[i].y) ||
                (snake[i - 1].movingUp && snake[i - 1].x > snake[i].x) ||
                (snake[i - 1].movingDown && snake[i - 1].x > snake[i].x)
              ) {
                snake[i].moveRight();
              } else if (
                (snake[i - 1].movingUp && snake[i - 1].x == snake[i].x) ||
                (snake[i - 1].movingLeft && snake[i - 1].y < snake[i].y) ||
                (snake[i - 1].movingRight && snake[i - 1].y < snake[i].y)
              ) {
                snake[i].moveUp();
              } else if (
                (snake[i - 1].movingDown && snake[i - 1].x == snake[i].x) ||
                (snake[i - 1].movingLeft && snake[i - 1].y > snake[i].y) ||
                (snake[i - 1].movingRight && snake[i - 1].y > snake[i].y)
              ) {
                snake[i].moveDown();
              }
            }
            score = snake.length * 1000;
            showScore();
          }
        }
      };

      class Cube {
        constructor(x, y, s = side) {
          this.x = x;
          this.y = y;
          this.s = s;
          this.offset = this.s;
          this.movingLeft = false;
          this.movingRight = false;
          this.movingUp = false;
          this.movingDown = false;
        }

        show() {
          p5.rectMode(p5.CENTER);
          p5.noStroke();
          p5.fill(255);
          p5.rect(this.x, this.y, this.s, this.s);
        }

        onFood() {
          if (
            p5.dist(this.x, 0, food.x, 0) <= (this.s + food.s) / 2 &&
            p5.dist(0, this.y, 0, food.y) <= (this.s + food.s) / 2
          ) {
            return true;
          } else {
            return false;
          }
        }

        moveLeft() {
          this.x -= vel;
          this.movingLeft = true;
          this.movingRight = false;
          this.movingUp = false;
          this.movingDown = false;
        }

        moveRight() {
          this.x += vel;
          this.movingLeft = false;
          this.movingRight = true;
          this.movingUp = false;
          this.movingDown = false;
        }

        moveUp() {
          this.y -= vel;
          this.movingLeft = false;
          this.movingRight = false;
          this.movingUp = true;
          this.movingDown = false;
        }

        moveDown() {
          this.y += vel;
          this.movingLeft = false;
          this.movingRight = false;
          this.movingUp = false;
          this.movingDown = true;
        }
      }
    };
    // Attach the canvas to the div
    const P5 = require("p5");
    new P5(script, "canvas");
  },
};
</script>
