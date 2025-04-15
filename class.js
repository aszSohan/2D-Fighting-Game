// Frames
class Sprite {
  constructor(
    position,
    imageSrc,
    scale,
    framesMax = 1,
    imageOffset = { x: 0, y: 0 }
  ) {
    this.position = {
      x: position.x,
      y: position.y,
    };

    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frames = 0;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 10; //Should be int type compulsorily
    this.imageOffset = imageOffset;
  }
  draw() {
    context.drawImage(
      // The source image
      this.image,
      // x and y coords in image and also it's height and width
      this.currentFrame * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      // x and y coords on canvas and width and height for rendering image on canvas
      this.position.x - this.imageOffset.x,
      this.position.y - this.imageOffset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesMax - 1) {
        this.currentFrame++;
        this.framesElapsed = 0;
      } else {
        this.currentFrame = 0;
        this.framesElapsed = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
    // console.log("Elapsed", this.framesElapsed);
  }
}

//Player Class
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    size,
    color,
    imageSrc,
    scale,
    framesMax = 1,
    imageOffset = {
      x: 0,
      y: 0,
      leftToRightImgOffset: { x: 0 },
      rightToLeftImgOffset: { x: 0 },
      deathOffsetY: 0,
    },
    sprites,
    sprites1,
    attackBox = {
      width: 0,
      height: 0,
      leftToRightOffset: { x: 0 },
      rightToLeftOffset: { x: 0 },
      hitFrame: 0,
      damage: 0,
    },
    flipped,
  }) {
    // Invoking parent class constructor
    super(position, imageSrc, scale, framesMax, imageOffset);

    // Velocity
    this.velocity = velocity;
    this.tempVelocityY = 0;

    // Jump Flag
    this.activeJump = false;
    // Size and Color
    this.size = size;
    this.color = color;
    // Need a rework
    this.indicator = {
      x: (this.position.x + this.size.width) / 2,
      y: this.position.y - 100,
      radius: 10,
    };
    // Key accuracy
    this.lastKey;

    // Attack
    this.attack = {
      // position: this.position, // In this line we're assigning reference the position object of current(this) object
      position: {
        //Here we are just assigning copy of properties of this.position of 'this' object
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      isAttacking: false,
      attackOffset: { x: 0, y: 0 },
      leftToRightOffset: attackBox.leftToRightOffset,
      rightToLeftOffset: attackBox.rightToLeftOffset,
      hitFrame: attackBox.hitFrame, // Should be > 1 OR greater than run and idle frames while passing as arguements
      damage: attackBox.damage,
    };

    //Player Health
    this.health = 100;

    // Frames & Images
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 12;
    this.sprites = sprites;
    this.sprites1 = sprites1;
    this.flipped = flipped;
    this.dead = false;

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
    }
    for (const sprite in this.sprites1) {
      this.sprites1[sprite].image = new Image();
      this.sprites1[sprite].image.src = this.sprites1[sprite].imageSrc;
    }
  }

  attackFlag() {
    this.attack.isAttacking = true;
    this.spriteChange("attack");
  }

  spriteChange(movement) {
    // OVERRIDING FOR DEATH
    if (
      this.image === this.sprites.death.image ||
      this.image === this.sprites1.death.image
    ) {
      if (this.currentFrame === this.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    // OVERRIDING FOR HIT
    if (
      (this.image === this.sprites.hit.image ||
        this.image === this.sprites1.hit.image) &&
      this.currentFrame < this.sprites.hit.framesMax - 1
    ) {
      return;
    }

    const currentSprites = this.flipped ? this.sprites1 : this.sprites;

    switch (movement) {
      case "idle":
        if (this.image !== currentSprites.idle.image) {
          this.image = currentSprites.idle.image;
          this.framesMax = currentSprites.idle.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "run":
        if (this.image !== currentSprites.run.image) {
          this.image = currentSprites.run.image;
          this.framesMax = currentSprites.run.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "jump":
        if (this.image !== currentSprites.jump.image) {
          this.image = currentSprites.jump.image;
          this.framesMax = currentSprites.jump.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "attack":
        if (this.image !== currentSprites.attack.image) {
          this.image = currentSprites.attack.image;
          this.framesMax = currentSprites.attack.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "hit":
        if (this.image !== currentSprites.hit.image) {
          this.image = currentSprites.hit.image;
          this.framesMax = currentSprites.hit.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "death":
        if (this.image !== currentSprites.death.image) {
          this.image = currentSprites.death.image;
          this.framesMax = currentSprites.death.framesMax;
          this.currentFrame = 0;
        }
        break;

      default:
        break;
    }
  }

  update() {
    this.attack.position.x = this.position.x + this.attack.attackOffset.x;
    this.attack.position.y = this.position.y + this.attack.attackOffset.y;

    // USEFUL FOR DEBUGGING POSITIONING OF IMAGES and ATTACKS
    // context.fillRect(
    //   this.attack.position.x,
    //   this.attack.position.y,
    //   this.attack.width,
    //   this.attack.height
    // );
    // context.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.size.width,
    //   this.size.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.size.height >= canvas.height - 120) {
      this.velocity.y = 0;
      this.position.y = canvas.height - this.size.height - 120;
      this.activeJump = true;
    } else {
      this.activeJump = false;
    }

    if (this.position.x <= 0) {
      this.velocity.x = 0;
      this.position.x = 0;
    } else if (this.position.x + this.size.width >= canvas.width) {
      this.velocity.x = 0;
      this.position.x = canvas.width - this.size.width;
    }

    if (!this.dead) {
      this.animateFrames();
    }

    this.draw();
  }
}
