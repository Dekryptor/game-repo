import { convertToMapCoords, getDistance } from './utils.js';
import { Camera } from './Camera.js';
import { Background } from './MapObject.js';
import { EventManager } from './EventManager.js';

export class GameMap {
    constructor(width, height, backgroundMapID, assetManager) {
        this.width = width;
        this.height = height;
        this.objects = [];
        this.camera = new Camera();
        this.DELTA_TIME = 0;
        this.LAST_UPDATE = 0;
        this.background = new Background(backgroundMapID, 0, 0, 10);
        this.eventManager = new EventManager(); // Initialize EventManager
    }

    calculateDeltaTime(timestamp) {
        this.DELTA_TIME = timestamp - this.LAST_UPDATE;
        this.LAST_UPDATE = timestamp;
    }

    getDeltaTime() {
        return this.DELTA_TIME;
    }

    addObject(object) {
        this.objects.push(object);
    }

    update() {
        this.objects.forEach(object => object.update());
        this.background.update();
        this.camera.update();
    }

    draw(ctx) {
        this.background.draw(ctx);
        this.objects.forEach(object => object.draw(ctx, this.camera.followX, this.camera.followY));
    }

    processDest() {
        if (!this.eventManager.isMouseDown) return;
        let dest = convertToMapCoords(this.eventManager.mouse, this.camera, halfScreenWidth, halfScreenHeight);
        let destX = Math.round(dest.x);
        let destY = Math.round(dest.y);
        let time = Math.round(
          (getDistance(this.player.x, this.player.y, destX, destY) / this.speed) * 1000
        );
        this.player.setDestination(destX, destY, time);
    }

    init() {
        this.createCanvas();
        this.resizeCanvas();
        this.eventManager.initListeners(); // Initialize event listeners
    }

    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "gamemap";
        this.canvas.classList.add("canvas");

        this.ctx = this.canvas.getContext("2d");

        document.body.appendChild(this.canvas);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        halfScreenWidth = Number(this.canvas.width) / 2;
        halfScreenHeight = Number(this.canvas.height) / 2;
        screenWidth = this.canvas.width;
        screenHeight = this.canvas.height;
    }
}