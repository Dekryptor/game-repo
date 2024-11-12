import { getDistance } from './utils.js';

export class EventManager {
  constructor() {
    this.isMouseDown = false;
    this.mouse = {
      x: null,
      y: null,
    };
    this.mouseInterval = null;
  }

  handleKeyPress({ keyCode }) {
    if (!gameInit) return;
    switch (keyCode) {
      case BTN_FPS:
        this.handleFpsRequest();
        break;
      default:
        break;
    }
  }

  // handlers
  handleFpsRequest() {
    // Implementation for FPS request
  }

  // utils, listeners
  getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }

  checkHover() {
    let cursor = "default";
    Object.values(assetsToLoad.ships).some((ship) => {
      let dist = getDistance(
        ship.render.renderX + ship.offset.x,
        ship.render.renderY + ship.offset.y,
        gameMap.eventManager.mouse.x,
        gameMap.eventManager.mouse.y
      );
      if (dist <= clickRange) {
        cursor = "pointer";
        return true;
      }
    });
    document.body.style.cursor = cursor;
  }

  handleMouseMov = (evMouse) => {
    this.mouse.x = evMouse.x;
    this.mouse.y = evMouse.y;
    this.checkHover();
  }

  initInterval() {
    gameMap.player.processDest();
    this.mouseInterval = setInterval(() => {
      gameMap.player.processDest();
    }, 75);
  }

  stopInterval() {
    clearInterval(this.mouseInterval);
  }

  handleMouseDown = () => {
    if (!this.isMouseDown && checkCollision()) return; // checks only on first click, checks whether user wanted to lock on
    if (gameMap.player.lockedControls) return;
    this.isMouseDown = true;
    gameMap.player.ship.isFly = true;
    this.initInterval();
  }

  handleMouseUp = () => {
    if (this.isMouseDown) {
      this.stopInterval();
      this.isMouseDown = false;
    }
  }

  initListeners() {
    document.body.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keypress", (keyPress) => {
      // if (gameMap.chat.getIsTyping()) return; // Chat class not implemented yet
      this.handleKeyPress(keyPress);
    });

    gameMap.canvas.addEventListener("mousedown", this.handleMouseDown);

    window.addEventListener("mousemove", this.handleMouseMov);
    window.addEventListener("resize", () => {
      gameMap.resizeCanvas();
      gameMap.resizeCanvas();
    });
  }
}