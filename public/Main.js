import { AssetManager } from './AssetManager.js';
import { Ship } from './Ship.js';
import { GameMap } from './GameMap.js';
import { Station } from './MapObject.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const assetManager = new AssetManager();
const assetsToLoad = [
    { name: 'background', src: './assets/background/galaxy.webp' },
    { name: 'ship', src: './assets/ships/ship1_0.webp' }
];

Promise.all(assetsToLoad.map(asset => assetManager.loadAsset(asset.name, asset.src))).then(() => {
    const gameMap = new GameMap(21000, 17000, 1, assetManager); // Using Background map object class for background
    const playerShip = new Ship(100, 100, 50, 50, 'ship', 'shipID', 36, assetManager);

    const station = new Station({ x: 500, y: 500, z: 1, rotation: 45, type: 1, id: 'station1' });

    gameMap.addObject(playerShip);
    gameMap.addObject(station);

    gameMap.camera.setCameraTarget(playerShip);

    function gameLoop(timestamp) {
        gameMap.calculateDeltaTime(timestamp);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameMap.update();
        gameMap.draw(ctx);
        requestAnimationFrame(gameLoop);
    }

    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('loading').style.display = 'none';
        requestAnimationFrame(gameLoop);
    });
});