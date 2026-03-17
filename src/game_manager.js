
let game = null;

function start_game()
{
  if (game) return;

  game = new Game();
  game.start();
}

function close_game()
{
  if (!game) return;

  game.stop();
  game = null;
}