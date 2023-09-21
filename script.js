/////////////////////////////////window popUp of rulse with click of button///////////////////////////////////

const rulesBtn = document.getElementById("rules-button");
const closeBtn = document.getElementById("close-button");
const rules = document.getElementById("rules");

rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});

///////////////////////////////////////canvas-drawing Elements/////////////////////////////////////////////////

const canvas = document.getElementById("canvas");
const element = canvas.getContext("2d");

///create a ball on the middle

const ball = {
  x: canvas.width / 2, // postion middel
  y: canvas.height / 2 + 240, // postion middel
  size: 10, //size of ball
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true,
};

function drawBall() {
  element.beginPath();
  element.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
  element.fillStyle = "black";
  element.fill();
  element.closePath();
}

///create a paddle on the middle

const paddle = {
  x: canvas.width / 2 - 40, // postion middel
  y: canvas.height / 2 + 250, // postion middel down
  w: 100, //size of ball
  h: 20,
  dx: 0,
  speed: 5,
  visible: true,
};

function drawPaddle() {
  element.beginPath();
  element.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  element.fillStyle = "black";
  element.fill();

  element.closePath();
}

///create a score on the side of the screen

let score = 0;

function drawScore() {
  element.font = "30px serif";
  element.fillText(`score: ${score}`, canvas.width - 120, 30);
}

///// create a bricks

const brickRowCount = 9;
const brickColumnsCount = 5;

const infoBrinks = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const Bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  Bricks[i] = [];
  for (let j = 0; j < brickColumnsCount; j++) {
    const t = i * (infoBrinks.w + infoBrinks.padding) + infoBrinks.offsetX;
    const s = j * (infoBrinks.h + infoBrinks.padding) + infoBrinks.offsetY;
    Bricks[i][j] = { t, s, ...infoBrinks };
  }
}

function drawBricks() {
  Bricks.forEach((column) => {
    column.forEach((bricks) => {
      element.beginPath();
      element.rect(bricks.t, bricks.s, infoBrinks.w, infoBrinks.h);
      element.fillStyle = bricks.visible
        ? `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
          })`
        : "transparent";
      element.fill();
      element.closePath();
    });
  });
}

//create a button to start

const button = {
  x: 350,
  y: 300,
  w: 100,
  h: 50,
  text: "start",
  visible: true,
};

/// updateAnimation (requestAnimationFrame)- update canvas

function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;

    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}
function moveBll() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  //supporting walls

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (ball.y - ball.size < 0) {
    ball.dy *= -1; ///change that
  }
  if (
    ball.x - ball.size - 3 > paddle.x &&
    ball.x + ball.size - 3 < paddle.x + paddle.w &&
    ball.y + ball.size - 3 > paddle.y
  ) {
    ball.dy = -ball.speed;
  }
  Bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.t - 20 &&
          ball.x + ball.size < brick.t + brick.s - 20 &&
          ball.y + ball.size > brick.s - 20 &&
          ball.y - ball.size < brick.s + infoBrinks.h - 20
        ) {
          ball.dy *= -1;
          audioManager();
          brick.visible = false;
          drawSong(score, arraySong);
          increasescore();
        }
      }
    });
  });

  //lose game

  if (ball.y + ball.size > canvas.height) {
    score = 0;
    alert(
      "Better luck next time! Keep practicing and you'll master this game."
    );
    document.location.reload();

    update();
    Bricks.forEach((column) => {
      column.forEach((bricks) => {
        bricks.visible = false;
      });
    });
  }
}

function drawCnvas() {
  element.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
}

function update() {
  if (!isAnimating.value) return;
  movePaddle();
  moveBll();
  requestAnimationFrame(update);
  drawCnvas();
}

const isAnimating = { value: false };

const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  if (!isAnimating.value) {
    isAnimating.value = true;
    update();
  }
});

//win game
function increasescore() {
  score++;

  if (score % (brickColumnsCount * brickRowCount) == 0) {
    showAllbricks();
    drawBall();
    score = 0;
  }
}
function showAllbricks() {
  Bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
}

//movment a paddle

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

function keydown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}
function keyup(e) {
  //   console.log(e.key); // showing the key on the keyboard like l,s,d,r
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

//audio

function audioManager() {
  let brickHit = new Audio("./sounds/bricgHit.mp3.mp3");
  if (brickHit.paused) {
    brickHit.play();
  }
}
const arraySong = [
  "We don't need no education",
  "We don't need no thought control",
  "No dark sarcasm in the classroom",
  "Teacher, leave them kids alone",
  "Hey, teacher, leave them kids alone",
  "All in all, it's just another brick in the wall",
  "All in all, you're just another brick in the wall",
  "We don't need no education",
  "We don't need no thought control",
  "No dark sarcasm in the classroom",
  "Teachers, leave them kids alone",
  "Hey, teacher, leave us kids alone",
  "All in all, you're just another brick in the wall",
  "All in all, you're just another brick in the wall",
  "If you don't eat yer meat, you can't have any pudding",
  "How can you have any pudding if you don't eat yer meat?",
  "You! Yes, you behind the bike stands",
];

const divSong = document.createElement("div");
divSong.id = "divSong";
document.body.appendChild(divSong);
const song = document.getElementById("song");
let line = document.createElement("li");
divSong.appendChild(song);
function drawSong(score, arraySong) {
  if (score == 17) {
    for (i = 0; i < 17; i++) {}
    line.innerHTML += `<li class="lyricsLine">${arraySong[i]}</li>`;

    song.appendChild(line);
    audioManagerRington();
  }
}

function audioManagerRington() {
  let BrinOnTheWall = new Audio("/sounds/anotherBricOnTheWall.mp3");
  if (BrinOnTheWall.paused) {
    BrinOnTheWall.play();
  }
}
