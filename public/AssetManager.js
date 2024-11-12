export class AssetManager {
    constructor() {
        this.assets = {};
    }

    loadAsset(name, src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.assets[name] = img;
                resolve();
            };
        });
    }

    getAsset(name) {
        return this.assets[name];
    }
}
