
let draggedWindow   = null;
let offsetX         = 0;
let offsetY         = 0;

function open_window(window)
{
    document.getElementById(window).style.display = "block";
}

function close_window(button)
{
    const window = button.closest('.window');
    if (window) {
        window.style.display = 'none';
    }
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
        const windowWidth  = draggedWindow.offsetWidth;
        const windowHeight = draggedWindow.offsetHeight;
        const screenWidth  = window.innerWidth;
        const screenHeight = window.innerHeight;

        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        newX = Math.max(0, Math.min(newX, screenWidth  - windowWidth));
        newY = Math.max(0, Math.min(newY, screenHeight - windowHeight));

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