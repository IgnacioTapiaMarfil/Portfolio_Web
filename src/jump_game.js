
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() 
{
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

class Game
{
  constructor()
  {
    this.player = null;
    this.obstacles = [];

    this.maxObstaclesTime = 3;
    this.minObstaclesTime = 1;

    this.obstacleTimer = 0;
    this.obstaclesTimerIndex = 0;

    this.running = false;
    this.animationFrameId = null;
  }

  start()
  {
    resizeCanvas();

    SetupKeyboardEvents();
    SetupMouseEvents();

    this.player = new Player(new Vector2(100, canvas.height/2), "resources/windows-95.png")

    this.running = true;
    
    this.obstacleTimer = RandomBetweenFloat(this.minObstaclesTime, this.maxObstaclesTime);

    this.update();
  }

  stop()
  {
    this.running = false;

    if (this.animationFrameId)
    {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  update()
  {
    if(!this.running) return;

    this.player.update();

    if(this.obstaclesTimerIndex <= this.obstacleTimer)
    {
      this.obstaclesTimerIndex += 0.02;
    }
    else
    {
      this.obstacles.push(new Obstacle(new Vector2(canvas.width, canvas.height-50)));
      this.obstacleTimer = RandomBetweenFloat(this.minObstaclesTime, this.maxObstaclesTime);
      this.obstaclesTimerIndex = 0;
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--)
    {
      const obstacle = this.obstacles[i];
      obstacle.update();

      if (obstacle.position.x + obstacle.boundingWidth < 0)
      {
        this.obstacles.splice(i, 1);
        continue;
      }

      if (CheckCollision2Rects(this.player.getCollider(), obstacle.getCollider())) 
      {
        this.stop();
        break;
      }
    }

    this.draw(ctx);

    Input.PostUpdate();

    this.animationFrameId = requestAnimationFrame(this.update.bind(this));
  }

  draw(ctx)
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.player.draw(ctx);

    for(let obstacle of this.obstacles)
    {
      obstacle.draw(ctx);
    }
  }
}

class Player 
{
  constructor(position, img) 
  {
    this.position = position;
    this.img = new Image();
    this.img.src = img;

    this.boundingWidth  = 30;
    this.boundingHeight = 50;
    this.boundingCrouchHeight = 20;

    this.velocityY = 0;
    this.gravity = 0.20;
    this.lowJumpGravity = 3;
    this.jumpStrength = -10;
    this.grounded = false;
    this.jumping = false;
    this.isCrouching = false;
  }

  update() 
  {
    const groundY = canvas.height - 50;

    if ((Input.IsKeyPressed(KEY_SPACE) || Input.IsKeyPressed(KEY_UP)) && this.grounded) 
    {
      this.velocityY = this.jumpStrength;
      this.grounded = false;
      this.jumping = true;
    }

    if (this.jumping && (Input.IsKeyUp(KEY_SPACE) || Input.IsKeyUp(KEY_UP))) 
    {
      this.velocityY += this.lowJumpGravity;
    } 
    else 
    {
      this.velocityY += this.gravity;
    }

    this.position.y += this.velocityY;

    if (this.position.y >= groundY) 
    {
      this.position.y = groundY;
      this.velocityY = 0;
      this.grounded = true;
      this.jumping = false;
    }

    if (Input.IsKeyPressed(KEY_DOWN) && !this.jumping) 
    {
      this.isCrouching = true;
    } 
    else 
    {
      this.isCrouching = false;
    }
  }

  getCollider() 
  {
    const height = this.isCrouching ? this.boundingCrouchHeight : this.boundingHeight;
    return {
      x: this.position.x - this.boundingWidth / 2,
      y: this.position.y - height,
      width: this.boundingWidth,
      height: height
    };
  }

  draw(ctx) 
  {
    if (this.img.complete) 
    {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(0.2, 0.2);
      ctx.drawImage(this.img, -this.img.width / 2, -this.img.height);
      ctx.restore();
    }

    const collider = this.getCollider();
    ctx.strokeStyle = "red";
    ctx.strokeRect(collider.x, collider.y, collider.width, collider.height);
  }
}

class Obstacle
{
  constructor(position)
  {
    this.position = position;

    this.img = new Image();
    this.img.src = "resources/windows-95.png";

    this.speed = 3;

    this.boundingWidth  = 30;
    this.boundingHeight = 50;
  }

  update()
  {
    this.position.x -= this.speed;
  }

  getCollider() 
  {
    return {
      x: this.position.x - this.boundingWidth / 2,
      y: this.position.y - this.boundingHeight,
      width: this.boundingWidth,
      height: this.boundingHeight
    };
  }

  draw(ctx)
  {
    if (this.img.complete) 
    {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(0.2, 0.2);
      ctx.drawImage(this.img, -this.img.width / 2, -this.img.height);
      ctx.restore();
    }

    const collider = this.getCollider();
    ctx.strokeStyle = "green";
    ctx.strokeRect(collider.x, collider.y, collider.width, collider.height);
  }
}