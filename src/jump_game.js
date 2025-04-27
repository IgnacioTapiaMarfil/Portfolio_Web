
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function startGame() {
  
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  
    let currentScene = null;

    SetupKeyboardEvents();
    SetupMouseEvents();
  
    const scenes = {
      menu: {
        update() {},
        draw() {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#fff";
          ctx.font = "20px monospace";
          ctx.fillText("Pulsa para empezar", 200, 240);
        },
        handleClick() 
        {
          currentScene = new Game();

          currentScene.start();
        }
      },
    };
  
    canvas.onclick = () => {
      if (currentScene && currentScene.handleClick) currentScene.handleClick();
    };
  
    function close()
    {
      currentScene = null;
    }

    function loop() {
      if (currentScene) 
      {
        currentScene.update();
        currentScene.draw(ctx);

        console.log("update")
      } 
      else 
      {
        // puedes poner un fallback como volver al menú o dejar pantalla en negro
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      Input.PostUpdate();

      requestAnimationFrame(loop);
    }
  
    currentScene = scenes.menu;
    loop();
  }

  class Game
  {
    constructor()
    {
      this.Player = null;
    }

    start()
    {
      this.player = new Player(new Vector2(100, canvas.height/2), "resources/windows-95.png")
    }

    update()
    {
      this.player.update();
    }

    draw(ctx)
    {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.player.draw(ctx);
    }
  }

class Player 
{
  constructor(position, img) 
  {
    this.position = position;
    this.img = new Image();
    this.img.src = img;

    this.boundingWidth  = 50;
    this.boundingHeight = 50;
    this.boundingCrouchHeight = 20;

    this.velocityY = 0;
    this.gravity = 0.15;
    this.lowJumpGravity = 1.75;
    this.jumpStrength = -7;
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
      console.log("soltado")
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

  getCollider() {
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

class Obstacles
{

}