import Game from '../game.js';

export default class Camera {
    static cameraMoving = {
        x: 0,
        y: 0
    }
    static cameraZoom = 1;
    static cameraMoveSpeed = 6;

    constructor() {
        document.addEventListener('mousemove', Camera.handleMouseMoveEvent);
        document.addEventListener('keydown', Camera.handleKeyDownEvent);
        document.addEventListener('keyup', Camera.handleKeyUpEvent);
        document.addEventListener('wheel', Camera.handleScrollEvent);
    }

    static getClickPosition(clientX, clientY, floor = true) {
        let x = (clientX + Math.abs(Game.camera.offsetLeft)) / Game.tileSize;
        let y = (clientY + Math.abs(Game.camera.offsetTop)) / Game.tileSize;
    
        if (floor) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
    
        return { x, y };
    }

    static moveCursor(x, y) {
        Game.tileCursor.style.left = (x * Game.tileSize) + "px";
        Game.tileCursor.style.top = (y * Game.tileSize) + "px";
    }

    static handleCameraMovement() {
        let cameraLeft = parseInt(Game.camera.style.left) + Camera.cameraMoving.x;
        let cameraTop = parseInt(Game.camera.style.top) + Camera.cameraMoving.y;
    
        cameraLeft = cameraLeft > 0 ? 0 : cameraLeft;
        cameraTop = cameraTop > 0 ? 0 : cameraTop;
    
        cameraLeft = cameraLeft < -((Game.mapSize.x * Game.tileSize) - Game.gameView.clientWidth) ? -((Game.mapSize.x * Game.tileSize) - Game.gameView.clientWidth) : cameraLeft;
        cameraTop = cameraTop < -((Game.mapSize.y * Game.tileSize) - Game.gameView.clientHeight) ? -((Game.mapSize.y * Game.tileSize) - Game.gameView.clientHeight) : cameraTop;
    
        Game.camera.style.left = cameraLeft + "px";
        Game.camera.style.top = cameraTop + "px";
    
        Camera.handleMouseMoveEvent(Game.lastMouseEvent);
    }

    static handleMouseMoveEvent(event) {
        if (!event || !event.target) {
            return; 
        }
        
        Game.lastMouseEvent = event;

        if ($(event.target).parents('#hotbar').length > 0) {
            Game.tileCursor.hidden = true;
            return;
        }
    
        Game.tileCursor.hidden = false;
        let tilePos = Camera.getClickPosition(event.clientX, event.clientY);
        Camera.moveCursor(tilePos.x, tilePos.y)
    }

    static handleKeyDownEvent(event) {
        if (event.keyCode == 37 || event.keyCode == 65) {
            Camera.cameraMoving.x = Camera.cameraMoveSpeed;
        } else if (event.keyCode == 38 || event.keyCode == 87) {
            Camera.cameraMoving.y = Camera.cameraMoveSpeed;
        } else if (event.keyCode == 39 || event.keyCode == 68) {
            Camera.cameraMoving.x = -Camera.cameraMoveSpeed;
        } else if (event.keyCode == 40 || event.keyCode == 83) {
            Camera.cameraMoving.y = -Camera.cameraMoveSpeed;
        }
    }
    
    static handleKeyUpEvent(event) {
        if (event.keyCode == 37 || event.keyCode == 65) {
            Camera.cameraMoving.x = 0;
        } else if (event.keyCode == 38 || event.keyCode == 87) {
            Camera.cameraMoving.y = 0;
        } else if (event.keyCode == 39 || event.keyCode == 68) {
            Camera.cameraMoving.x = 0;
        } else if (event.keyCode == 40 || event.keyCode == 83) {
            Camera.cameraMoving.y = 0;
        }
    }

    static handleScrollEvent(event) {
        let middlePos = Camera.getClickPosition(Game.gameView.clientWidth / 2, Game.gameView.clientHeight / 2, false);
    
        if (scrollingUp(event)) {
            if (Camera.cameraZoom * 1.1 > 2) {
                return;
            }
            Camera.cameraZoom = round(Camera.cameraZoom * 1.1, 1);
            Game.camera.style.left = ((parseInt(Game.camera.style.left)) * 1.1) + "px";
            Game.camera.style.top = ((parseInt(Game.camera.style.top)) * 1.1) + "px";
        } else {
            if (Camera.cameraZoom / 1.1 < 0.5) {
                return;
            }
            Camera.cameraZoom = round(Camera.cameraZoom / 1.1, 1);
            Game.camera.style.left = ((parseInt(Game.camera.style.left)) / 1.1) + "px";
            Game.camera.style.top = ((parseInt(Game.camera.style.top)) / 1.1) + "px";
        }
        
        Game.tileSize = Game.origTileSize * Camera.cameraZoom;
        Game.itemSize = Game.origItemSize * Camera.cameraZoom;
    
        $('.tile').css('width', Game.tileSize + 'px');
        $('.item').css('width', Game.itemSize + 'px');
        $('.tile').each(function () {
            let tile = $(this);
            tile.css('left', (tile.data('x') * Game.tileSize) + 'px');
            tile.css('top', (tile.data('y') * Game.tileSize) + 'px');
        });
    
        Camera.moveCameraTo(middlePos.x, middlePos.y);
    
        Camera.handleCameraMovement();
    }
    
    static moveCameraTo(x, y) {
        Game.camera.style.left = (Game.gameView.clientWidth / 2 - x * Game.tileSize) + "px";
        Game.camera.style.top = (Game.gameView.clientHeight / 2 - y * Game.tileSize) + "px";
    }
}