if (!'content' in document.createElement('template')) {
    alert('Your browser does not support HTML5 template elements. Please upgrade your browser.');
    location.href = "/";
}

import Camera from './game/camera.js';
import './game/tiles/tileUtil.js';

class Game {
    static tps = 60;
    static origTileSize = 32;
    static origItemSize = 12;
    static tileSize = this.origTileSize;
    static itemSize = this.origItemSize;
    static mapSize = {
        x: 1000,
        y: 1000
    };
    
    static tiles = [];
    static items = [];
    static lastMouseEvent = null;
    static rotation = 0;
    
    static gameView = document.querySelector("#gameview");
    static camera = document.querySelector("#camera");
    static tileCursor = document.querySelector("#tile-cursor");
    static templates = {};

    static cameraObj = new Camera();
    
    constructor() {
        let templates = {};
        $('template').each(function () {
            templates[this.id] = this;
        });

        Game.templates = templates;

        Game.camera.style.width = (Game.tileSize * Game.mapSize.x) + "px";
        Game.camera.style.height = (Game.tileSize * Game.mapSize.y) + "px";
        Game.camera.style.left = -((Game.tileSize * Game.mapSize.y / 2) + (Game.tileSize / 2)) + "px";
        Game.camera.style.top = -((Game.tileSize * Game.mapSize.y / 2) + (Game.tileSize / 2)) + "px";
        
        Game.tileCursor.style.width = Game.tileSize + "px";
    }
}

setInterval(Camera.handleCameraMovement, 1000 / 120);

let gameLoop = function () {
    Game.tiles.forEach(curTile => {
        if (curTile.tickUpdate) {
            curTile.tickUpdate();
        }
    })
};
setInterval(gameLoop, 1000 / Game.tps);

const game = new Game();

export default Game;