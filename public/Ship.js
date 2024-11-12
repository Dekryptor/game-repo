import { toDegs, calcAngle } from './utils.js';

export class Ship {
    constructor(x, y, width, height, spriteSrc, shipID, maxRotation, assetManager) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = assetManager.getAsset(spriteSrc);
        this.speed = { x: 0, y: 0 };
        this.isFly = false;
        this.shipID = shipID;
        this.maxRotation = maxRotation;
        this.sequenceNum = 0;
        this.sequenceNumEnd = 0;
        this.rotationIncr = 0;
        this.pointingAngle = 0;
        this.rotationCalc = 360 / maxRotation;
    }

    update() {
        this.changePos();
        this.changeRenderPos();
        this.rotateToSeq();
    }

    draw(ctx, cameraX, cameraY) {
        ctx.drawImage(this.sprite, this.x - cameraX, this.y - cameraY, this.width, this.height);
    }

    setDestination(x, y, time) {
        this.setSmooth = true;
        this.destX = x;
        this.destY = y;
        this.timeTo = time;
        let distanceX = this.destX - this.x;
        let distanceY = this.destY - this.y;
        this.speed.x = distanceX / this.timeTo;
        this.speed.y = distanceY / this.timeTo;
        this.isFly = true;
    }

    stopFlying() {
        this.isFly = false;
    }

    changePos() {
        this.x += this.speed.x * gameMap.getDeltaTime();
        this.y += this.speed.y * gameMap.getDeltaTime();
        this.timeTo -= gameMap.getDeltaTime();
        if (Math.round(this.timeTo) <= 0) this.stopFlying();
    }

    changeRenderPos() {
        this.render.renderX = this.x - this.offset.x - camera.followX + halfScreenWidth;
        this.render.renderY = this.y - this.offset.y - camera.followY + halfScreenHeight;
    }

    rotate() {
        const rotateTo = {
            x: this.destX,
            y: this.destY,
        };
        let newPointAngle = calcAngle(this.x, this.y, rotateTo.x, rotateTo.y);
        this.pointingAngle = newPointAngle;
        this.setSequence();
    }

    setSmoothRotation() {
        const currAngle = this.sequenceNum * this.rotationCalc;
        const goalAngle = toDegs(this.pointingAngle);
        let plusDist, minusDist;
        if (currAngle < goalAngle) {
            plusDist = goalAngle - currAngle;
            minusDist = 360 - plusDist;
        } else {
            minusDist = goalAngle - currAngle;
            plusDist = 360 + minusDist;
        }
        if (Math.abs(plusDist) > Math.abs(minusDist)) {
            this.rotationIncr = -1;
        } else {
            this.rotationIncr = 1;
        }
        this.setSmooth = false;
    }

    rotateToSeq() {
        this.sequenceNum += this.rotationIncr;
        if (this.sequenceNum < 0) this.sequenceNum = this.maxRotation;
        else if (this.sequenceNum > this.maxRotation) this.sequenceNum = 0;
        if (this.sequenceNum == this.sequenceNumEnd) {
            this.rotationIncr = 0;
        }
    }

    setSequence() {
        if (this.setSmooth) {
            const newNumEnd = Math.round(toDegs(this.pointingAngle) / this.rotationCalc);
            if (this.sequenceNumEnd != newNumEnd) {
                this.sequenceNumEnd = newNumEnd;
                this.setSmoothRotation();
            }
        }
        this.rotateToSeq();
        this.sprite = preloader.modelsBuffer.ships[this.shipID][this.sequenceNum];
    }
}