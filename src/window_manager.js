let zIndexCounter = 1;
let draggedWindow   = null;
let offsetX         = 0;
let offsetY         = 0;

function isCompactLandscape()
{
  return window.matchMedia('(max-width: 1024px) and (orientation: landscape)').matches;
}

function hideOtherWindows(activeWindowId)
{
  document.querySelectorAll('.window').forEach((windowElement) => {
    if (windowElement.id !== activeWindowId)
      windowElement.style.display = 'none';
  });
}

function getPointerPosition(event)
{
  if (event.touches && event.touches.length > 0)
  {
    return {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY
    };
  }

  if (event.changedTouches && event.changedTouches.length > 0)
  {
    return {
      clientX: event.changedTouches[0].clientX,
      clientY: event.changedTouches[0].clientY
    };
  }

  return {
    clientX: event.clientX,
    clientY: event.clientY
  };
}

function shouldStartDrag(event)
{
  const target = event.target;
  if (!target || typeof target.closest !== 'function')
    return true;

  return !target.closest('.close-button');
}

function updateProjectHeadingDividers()
{
  const compactDivider = '----------';
  const isCompact = isCompactLandscape();

  document.querySelectorAll('.project-text h3').forEach((heading) => {
    if (!heading.dataset.originalHtml)
      heading.dataset.originalHtml = heading.innerHTML;

    if (isCompact)
    {
      heading.innerHTML = heading.dataset.originalHtml.replace(/-{10,}/g, compactDivider);
      return;
    }

    heading.innerHTML = heading.dataset.originalHtml;
  });
}

function registerTouchActiveFeedback()
{
  const activeSelectors = '.icon, .start-button, .close-button, .tabs-button button, .arrow, .link-button, .menu-item, .first-menu-item';

  const clearActiveState = () => {
    document.querySelectorAll('.is-active').forEach((element) => {
      element.classList.remove('is-active');
    });
  };

  document.addEventListener('touchstart', (event) => {
    const target = event.target.closest(activeSelectors);
    if (!target)
      return;

    clearActiveState();
    target.classList.add('is-active');
  }, { passive: true });

  document.addEventListener('touchend', clearActiveState, { passive: true });
  document.addEventListener('touchcancel', clearActiveState, { passive: true });
}

function open_window(windowId)
{
  if(!windowId)
    return;

  const windowElement = document.getElementById(windowId);
  if (!windowElement)
    return;

  if (isCompactLandscape())
    hideOtherWindows(windowId);

  windowElement.style.display = "block";
  bring_front(windowId);

  if(windowId == "game_window")
  {
    setTimeout(() => {
      if (typeof start_game === 'function') start_game();
    }, 100);
  }
}

let lang = "es";

function setLanguage() {
  lang = lang === "es" ? "en" : "es";

  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
  });
}

function close_window(button)
{
  const windowElement = button.closest('.window');

  if(!windowElement)
    return;

  if(windowElement.id == "game_window")
  {
    close_game();
  }
  windowElement.style.display = 'none';

}

function start_draging(event, windowElement)
{
    const pointer = getPointerPosition(event);

    if (event.cancelable)
      event.preventDefault();

    draggedWindow = windowElement;

    offsetX = pointer.clientX - windowElement.offsetLeft;
    offsetY = pointer.clientY - windowElement.offsetTop;
    
    document.addEventListener('mousemove', move_window);
    document.addEventListener('mouseup', stop_draging);
    document.addEventListener('touchmove', move_window, { passive: false });
    document.addEventListener('touchend', stop_draging);
}

function move_window(event) 
{
    if (draggedWindow) 
    {
        const pointer = getPointerPosition(event);

        if (event.cancelable)
          event.preventDefault();

        const windowWidth  = draggedWindow.offsetWidth / 2;
        const windowHeight = draggedWindow.offsetHeight;
        const screenWidth  = window.innerWidth;
        const screenHeight = window.innerHeight;

        let newX = pointer.clientX - offsetX;
        let newY = pointer.clientY - offsetY;

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
  document.removeEventListener('touchmove', move_window);
  document.removeEventListener('touchend', stop_draging);
  draggedWindow = null;
}

function bring_front(window)
{
  if (!document.getElementById(window))
    return;

  zIndexCounter++;
  document.getElementById(window).style.zIndex = zIndexCounter;
}

document.addEventListener('DOMContentLoaded', () => {
  registerTouchActiveFeedback();
  updateProjectHeadingDividers();

  document.querySelectorAll('.window-header').forEach((header) => {
    header.addEventListener('touchstart', (event) => {
      if (!shouldStartDrag(event))
        return;

      start_draging(event, header.parentElement);
    }, { passive: false });
  });

  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start_menu');

  if (!startButton || !startMenu)
    return;

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

window.addEventListener('resize', updateProjectHeadingDividers);