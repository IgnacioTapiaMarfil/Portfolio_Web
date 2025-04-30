
let game = null;


function start_game()
{
  if(game) return;

  game = new Game();

  game.start();
}

function close_game()
{
  if(!game) return;

  game.stop();
  game = null;

  console.log("close");
}

// function loop() 
// {
//   if (game) 
//   {
//     game.update();
//     game.draw(ctx);

//     console.log("update")
    
//     Input.PostUpdate();
  
//     requestAnimationFrame(loop);
//   } 
//   else 
//   {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   }

// }