const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// console.log("asdwda", canvas);
// console.log(context);

//Dimensions & Style
canvas.width = 1280;
canvas.height = 760;
canvas.style.backgroundColor = "#414141";

// window.addEventListener("click", () => {
//   document.documentElement.requestFullscreen();
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });

let timer = 100;
let intervalID;
function Winner() {
  clearInterval(intervalID);
  cancelAnimationFrame(AnimationID);
  // document.getElementById("GameOver").style.display = "block";
  if (player2.health > player1.health) {
    console.log("Player 2 Win");
  } else if (player1.health > player2.health) {
    console.log("Player 1 Win");
  } else {
    console.log("It's tie");
  }
}
function Timer() {
  ///////////////////////////// BY setInterval() //////////////////////////////////
  intervalID = setInterval(() => {
    if (timer > 0) {
      timer--;
      document.getElementById("TimerCount").textContent = timer;
    } else {
      Winner();
    }
  }, 1000);
  //////////////////////////////////// BY setTimeout() ////////////////////////////////////////
  // A recursive approach! First invocation of Timer() evaluates and runs all code inside the  Timer() but if timer > 0 then setTimout() is invoked with Timer() as callback till timer becomes 0
  //Once an instance of setTimeout() finishes the code, the garbage collector removes it's remanants and new setTimeout's callback is initiated
  // if (timer > 0) {
  //   setTimeout(Timer, 1000);
  //   timer--;
  //   document.getElementById("TimerCount").textContent = timer;
  // } else {
  //   if (player2.health > player1.health) {
  //     console.log("Player 2 Win");
  //   } else if (player1.health > player2.health) {
  //     console.log("Player 1 Win");
  //   } else {
  //     console.log("It's tie");
  //   }
  // }
}
Timer();
function AttackCollision(currentPlayer, comparedPlayer) {
  return (
    ((currentPlayer.attack.position.x + currentPlayer.attack.width >=
      comparedPlayer.position.x &&
      currentPlayer.position.x <=
        comparedPlayer.position.x + comparedPlayer.size.width) ||
      (currentPlayer.attack.position.x <=
        comparedPlayer.position.x + comparedPlayer.size.width &&
        currentPlayer.position.x >=
          comparedPlayer.position.x + comparedPlayer.size.width)) &&
    currentPlayer.attack.position.y + currentPlayer.attack.height >=
      comparedPlayer.position.y &&
    currentPlayer.attack.position.y + currentPlayer.attack.height <=
      comparedPlayer.position.y + comparedPlayer.size.height
  );
}

let AnimationID;

function Animate() {
  if (GAMESTART) {
    // YET TO WORK ON THIS
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  backgroundImage.update();
  // shop.update();
  //Player 1 movement evaluation
  player1.tempVelocityY = player1.velocity.y;
  player1.velocity.x = 0;
  player1.velocity.y = 0;
  if (keys.w.pressed && player1.activeJump) {
    player1.velocity.y = -50;
    player1.tempVelocityY = 0;
  } else {
    // console.log("VELOCITY", player1.tempVelocityY);

    player1.velocity.y = gravity + player1.tempVelocityY;
  }

  if (keys.a.pressed && player1.lastKey === "KeyA") {
    player1.velocity.x += -25;
    player1.flipped = true;
    player1.spriteChange("run");
  } else if (keys.d.pressed && player1.lastKey === "KeyD") {
    player1.velocity.x += 25;
    player1.flipped = false;
    player1.spriteChange("run");
  } else if (player1.velocity.y < 0) {
    player1.spriteChange("jump");
  } else if (keys.space.pressed) {
    player1.attackFlag();
  } else {
    player1.spriteChange("idle");
    // player1.spriteChange("attack");
  }

  //Player 2 movement evaluation
  player2.tempVelocityY = player2.velocity.y;
  player2.velocity.x = 0;
  player2.velocity.y = 0;
  if (keys.up.pressed && player2.activeJump) {
    player2.velocity.y = -50;
    player2.tempVelocityY = 0;
  } else {
    player2.velocity.y += gravity + player2.tempVelocityY;
  }

  if (keys.left.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -25;
    player2.spriteChange("run");
  } else if (keys.right.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 25;
    player2.spriteChange("run");
  } else if (player2.velocity.y < 0) {
    player2.spriteChange("jump");
  } else if (keys.enter.pressed) {
    player2.attackFlag();
  } else {
    player2.spriteChange("idle");
  }

  //Attack collision detection
  //For Player 1
  if (
    player1.attack.isAttacking &&
    AttackCollision(player1, player2) &&
    player1.currentFrame >= player1.attack.hitFrame
  ) {
    console.log("P1");

    player2.spriteChange("hit");
    player2.health -= player1.attack.damage;
    document.getElementById("P2Health").style.width = player2.health + "%";
    console.log(player2.health);
    player1.attack.isAttacking = false;
  }

  // HIT MISS
  if (player1.isAttacking && player1.currentFrame >= player1.attack.hitFrame) {
    player1.isAttacking = false;
  }

  // FOR PLAYER 2 ATTACK
  if (
    player2.attack.isAttacking &&
    AttackCollision(player2, player1) &&
    player2.currentFrame >= player2.attack.hitFrame
  ) {
    //For Player 2
    console.log("P2");
    player1.health -= player2.attack.damage;
    document.getElementById("P1Health").style.width = player1.health + "%";
    console.log(player1.health);
    player1.spriteChange("hit");
    player2.attack.isAttacking = false;
  }
  if (player2.isAttacking && player2.currentFrame >= player2.attack.hitFrame) {
    player2.isAttacking = false;
  }

  //Attack direction evaluation & Player's face direction
  if (player1.position.x >= player2.position.x) {
    player1.flipped = true;
    player2.flipped = false;

    player1.imageOffset.x = player1.imageOffset.rightToLeftImgOffset.x;
    player2.imageOffset.x = player2.imageOffset.leftToRightImgOffset.x;

    player1.attack.attackOffset.x = player1.attack.rightToLeftOffset.x;
    player2.attack.attackOffset.x = player2.attack.leftToRightOffset.x;
  } else {
    player1.flipped = false;
    player2.flipped = true;

    // Aligning images
    player1.imageOffset.x = player1.imageOffset.leftToRightImgOffset.x;
    player2.imageOffset.x = player2.imageOffset.rightToLeftImgOffset.x;

    // Aligning attack box
    player1.attack.attackOffset.x = player1.attack.leftToRightOffset.x;
    player2.attack.attackOffset.x = player2.attack.rightToLeftOffset.x;
  }

  // END GAME
  if (player1.health <= 0) {
    player1.spriteChange("death");
    player1.imageOffset.y = player1.imageOffset.deathOffsetY;
  } else if (player2.health <= 0) {
    player2.spriteChange("death");
    player2.imageOffset.y = player2.imageOffset.deathOffsetY;
  }

  if (player1.dead || player2.dead) {
    player1.update();
    player2.update();
    Winner();
    return;
  } else {
    player1.update();
    player2.update();
    cancelAnimationFrame(AnimationID); // Short optimization
    AnimationID = requestAnimationFrame(Animate);
  }
}

window.addEventListener("keydown", function (event) {
  console.log(event);
  console.log(event.code);
  switch (event.code) {
    case "KeyW":
      keys.w.pressed = true;
      break;
    case "KeyA":
      keys.a.pressed = true;
      player1.lastKey = "KeyA";
      break;
    case "KeyS":
      break;
    case "KeyD":
      keys.d.pressed = true;
      player1.lastKey = "KeyD";
      break;
    case "Space":
      // player1.isAttacking = true;
      keys.space.pressed = true;
      break;

    case "ArrowUp":
      keys.up.pressed = true;
      break;
    case "ArrowDown":
      keys.down.pressed = true;
      break;
    case "ArrowLeft":
      keys.left.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.right.pressed = true;
      player2.lastKey = "ArrowRight";
      break;
    case "Enter":
      keys.enter.pressed = true;
      break;
    default:
      console.log("Control not defined");
      break;
  }
});

window.addEventListener("keyup", function (event) {
  switch (event.code) {
    //P1 keyup response
    case "KeyW":
      keys.w.pressed = false;
      break;
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyS":
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "Space":
      keys.space.pressed = false;
      break;

    //P2 keyup response
    case "ArrowUp":
      keys.up.pressed = false;
      break;
    case "ArrowDown":
      keys.down.pressed = false;
      break;
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;
    case "Enter":
      keys.enter.pressed = false;
      break;
    default:
      console.log("Control not defined");
      break;
  }
});

//TECHNICAL REQUIREMENTS
const gravity = 2.5;
let keys = {
  //Player 1 flags
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  //Player 2 flags
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  enter: {
    pressed: false,
  },
};
let GAMESTART = false;

//OBJECTS
// The "./" is necessary while passing location of a file, ./ is representing 'From Current Location' navigate to further tree of directory
const backgroundImage = new Sprite({ x: 0, y: 0 }, "./Assets/GAME.png", 1);
const shop = new Sprite({ x: 815, y: 128 }, "./Assets/shop1.png", 1, 6);

const player1 = new Fighter({
  position: { x: 250, y: 10 },
  velocity: { x: 0, y: 10 },
  size: { width: 80, height: 190 },
  color: "blue",
  imageSrc: "./Assets/GOKU/IDLE FLY.png",
  scale: 4,
  framesMax: 2,
  imageOffset: {
    x: 80,
    y: 50,
    leftToRightImgOffset: { x: 80 },
    rightToLeftImgOffset: { x: 100 },
    deathOffsetY: -50,
  },
  sprites: {
    idle: {
      imageSrc: "./Assets/GOKU/LeftToRight/IDLE FLY.png",
      framesMax: 2,
    },
    run: {
      imageSrc: "./Assets/GOKU/LeftToRight/FLYY.png",
      framesMax: 2,
    },
    jump: {
      imageSrc: "./Assets/GOKU/LeftToRight/JUMP.png",
      framesMax: 1,
    },
    attack: {
      imageSrc: "./Assets/GOKU/LeftToRight/ATTACK.png",
      framesMax: 14,
    },
    hit: {
      imageSrc: "./Assets/GOKU/LeftToRight/HIT.png",
      framesMax: 2,
    },
    death: {
      imageSrc: "./Assets/GOKU/LeftToRight/DEATH.png",
      framesMax: 2,
    },
  },
  sprites1: {
    idle: {
      imageSrc: "./Assets/GOKU/RightToLeft/IDLE FLY.png",
      framesMax: 2,
    },
    run: {
      imageSrc: "./Assets/GOKU/RightToLeft/FLYY.png",
      framesMax: 2,
    },
    jump: {
      imageSrc: "./Assets/GOKU/RightToLeft/JUMP.png",
      framesMax: 1,
    },
    attack: {
      imageSrc: "./Assets/GOKU/RightToLeft/ATTACK.png",
      framesMax: 14,
    },
    hit: {
      imageSrc: "./Assets/GOKU/RightToLeft/HIT.png",
      framesMax: 2,
    },
    death: {
      imageSrc: "./Assets/GOKU/RightToLeft/DEATH.png",
      framesMax: 2,
    },
  },
  attackBox: {
    height: 50,
    width: 100,
    leftToRightOffset: { x: 20 },
    rightToLeftOffset: { x: -35 },
    hitFrame: 2,
    damage: 0.5,
  },
  flipped: false,
});

const player2 = new Fighter({
  position: { x: 1000, y: 10 },
  velocity: { x: 10, y: 10 },
  size: { width: 80, height: 190 },
  color: "red",
  imageSrc: "./Assets/MR SYTHE/MR Sythe IDLE.png",
  scale: 5,
  framesMax: 2,
  imageOffset: {
    x: 60,
    y: -30,
    leftToRightImgOffset: { x: 25 },
    rightToLeftImgOffset: { x: 60 },
    deathOffsetY: -50,
  },
  sprites: {
    idle: {
      imageSrc: "./Assets/MR SYTHE/LeftToRight/MR Sythe IDLE.png",
      framesMax: 2,
    },
    run: {
      imageSrc: "./Assets/MR SYTHE/LeftToRight/RUN.png",
      framesMax: 3,
    },
    jump: {
      imageSrc: "./Assets/MR SYTHE/LeftToRight/RUN.png",
      framesMax: 3,
    },
    attack: {
      imageSrc: "./Assets/MR SYTHE/LeftToRight/ATTACK.png",
      framesMax: 8,
    },
    hit: {
      imageSrc: "./Assets/MR SYTHE/LeftToRight/HIT.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./Assets/MR SYTHE/LeftToRight/DEATH.png",
      framesMax: 8,
    },
  },
  sprites1: {
    idle: {
      imageSrc: "./Assets/MR SYTHE/RightToLeft/MR Sythe IDLE.png",
      framesMax: 2,
    },
    run: {
      imageSrc: "./Assets/MR SYTHE/RightToLeft/RUN.png",
      framesMax: 3,
    },
    jump: {
      imageSrc: "./Assets/MR SYTHE/RightToLeft/RUN.png",
      framesMax: 3,
    },
    attack: {
      imageSrc: "./Assets/MR SYTHE/RightToLeft/ATTACK.png",
      framesMax: 8,
    },
    hit: {
      imageSrc: "./Assets/MR SYTHE/RightToLeft/HIT.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./Assets/MR SYTHE/RightToLeft/DEATH.png",
      framesMax: 8,
    },
  },
  attackBox: {
    height: 50,
    width: 65,
    leftToRightOffset: { x: 80 },
    rightToLeftOffset: { x: -50 },
    hitFrame: 4,
    damage: 0.5,
  },
  flipped: true,
});

console.log(player1.size);

Animate();

//TRIALS
// console.log(window.innerWidth, window.innerHeight);
// let P2Health = document.getElementById("P2Health");
// let width = window.getComputedStyle(P2Health).width;
// console.log(
//   "P1 - ",
//   window.getComputedStyle(P1Health).width,
//   "P2 - ",
//   window.getComputedStyle(P2Health).width,
//   window.innerWidth,
//   "x",
//   window.innerHeight
// );
