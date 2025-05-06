let zIndexCounter = 1;
let draggedWindow   = null;
let offsetX         = 0;
let offsetY         = 0;

function open_window(window)
{
  if(!window)
    return;

  if(window == "game_window")
  {
    document.getElementById(window).style.display = "block";
    setTimeout(() => {
      if (typeof start_game === 'function') start_game();
    }, 100);
  }else
  {
    document.getElementById(window).style.display = "block";
    setTimeout(() => {
        bring_front(window);
      }, 10);
  }
}

let lang = "es";

function setLanguage() {
  lang = lang === "es" ? "en" : "es";

  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });
}

function close_window(button)
{
  const window = button.closest('.window');

  if(!window)
    return;

  if(window.id == "game_window")
  {
    close_game();
  }
  window.style.display = 'none';

}

function start_draging(event, window)
{
    draggedWindow = window;

    offsetX = event.clientX - window.offsetLeft;
    offsetY = event.clientY - window.offsetTop;
    
    document.addEventListener('mousemove', move_window);
    document.addEventListener('mouseup', stop_draging);
}

function move_window(event) 
{
    if (draggedWindow) 
    {
        const windowWidth  = draggedWindow.offsetWidth / 2;
        const windowHeight = draggedWindow.offsetHeight;
        const screenWidth  = window.innerWidth;
        const screenHeight = window.innerHeight;

        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        newX = Math.max(0 - windowWidth * 1.5 , Math.min(newX, screenWidth  - windowWidth / 4 ));
        newY = Math.max(0, Math.min(newY, screenHeight - windowHeight / 4));

        draggedWindow.style.left = newX + 'px';
        draggedWindow.style.top  = newY + 'px';
    }
  }
  
function stop_draging() 
{
  document.removeEventListener('mousemove', move_window);
  document.removeEventListener('mouseup', stop_draging);
  draggedWindow = null;
}

function bring_front(window)
{
  zIndexCounter++;
  document.getElementById(window).style.zIndex = zIndexCounter;
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start_menu');

  startButton.addEventListener('click', () => {
    const isVisible = startMenu.style.display === 'block';
    startMenu.style.display = isVisible ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
      startMenu.style.display = 'none';
    }
  });
});