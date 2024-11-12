import { toRadians, getDistance } from './utils.js';

export class MapObject {
    constructor(x, y, z = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.renderX = null;
        this.renderY = null;
        this.sprite = new Image();
        this.offset = {
            x: 0,
            y: 0
        };
    }

    draw() {
        gameMap.ctx.drawImage(
            this.sprite,
            this.renderX - this.offset.x,
            this.renderY - this.offset.y
        );
    }

    calculateRenderPos() {
        this.renderX = this.x - camera.followX / this.z + halfScreenWidth;
        this.renderY = this.y - camera.followY / this.z + halfScreenHeight;
    }
}

export class Background extends MapObject {
    constructor(mapID, x = 0, y = 0, z = 10) {
        super(x, y, z);
        this.mapID = mapID;
        this.sprite.src = `${assetManager.getAsset('background')}`;
        this.settingMenu = MENU_GRAPHICS;
        this.settingIndex = 0;
        this.musicTheme = null;
        this.music = null;
        this.setCoords();
    }

    setTheme(theme, isInit = false) {
        if (theme == this.musicTheme) return;
        this.musicTheme = theme;
        if (!isInit) this.music.stop();
        this.music = new Sound(
            "./spacemap/audio/themes/" + theme + ".mp3",
            true,
            1
        );
        this.music.play();
    }

    setCoords() {
        this.x = ((mapScale - 1) * realMapWidth) / 4 / 10;
        this.y = ((mapScale - 1) * realMapHeight) / 4 / 10;
    }

    setNewMap(mapId) {
        this.mapID = mapId;
        this.sprite.src = `${assetManager.getAsset('background')}`;
        this.setCoords();
    }

    update() {
        if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
        this.calculateRenderPos();
        this.draw();
    }
}

export class Station extends MapObject {
    constructor({ x, y, z, rotation, type, id }) {
        super(x, y, z);
        this.type = type;
        this.id = id;
        this.angle = toRadians(rotation);
        this.offset = getStationOffset(type);
        this.sprite.src = `./spacemap/stations/base${type}.png`;
    }

    draw() {
        gameMap.ctx.translate(this.renderX, this.renderY);
        gameMap.ctx.rotate(-this.angle);
        gameMap.ctx.drawImage(this.sprite, -this.offset.x, -this.offset.y);
        gameMap.ctx.rotate(this.angle);
        gameMap.ctx.translate(-this.renderX, -this.renderY);
    }

    update() {
        this.calculateRenderPos();
        this.draw();
    }
}