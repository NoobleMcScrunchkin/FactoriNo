if (!'content' in document.createElement('template')) {
    alert('Your browser does not support HTML5 template elements. Please upgrade your browser.');
    location.href = "/";
}

const gameView = document.querySelector("#gameview");
const camera = document.querySelector("#camera");
const tileCursor = document.querySelector("#tile-cursor");
let templates = {};

$('template').each(function () {
    templates[this.id] = this;
});

console.log(templates);

const cameraMoveSpeed = 6;
const tps = 120;
const origTileSize = 32;
let tileSize = origTileSize;
const mapSize = {
    x: 1000,
    y: 1000
};

let cameraZoom = 1;
let tiles = [];
let cameraMoving = {
    x: 0,
    y: 0
}
let lastMouseEvent = null;
let rotation = 0;

camera.style.width = (tileSize * mapSize.x) + "px";
camera.style.height = (tileSize * mapSize.y) + "px";
camera.style.left = -((tileSize * mapSize.y / 2) + (tileSize / 2)) + "px";
camera.style.top = -((tileSize * mapSize.y / 2) + (tileSize / 2)) + "px";

tileCursor.style.width = tileSize + "px";

const round = function (value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const createTile = function (x, y) {
    if (x >= mapSize.x || y >= mapSize.y) {
        return;
    }

    if (camera.querySelector(".tile[data-x='" + x + "'][data-y='" + y + "']")) {
        return;
    }

    let type = getSelectedHotbarItem();
    let clone = templates[type.tile].content.cloneNode(true);
    let newTile = clone.querySelector(".tile");

    newTile.style.left = (x * tileSize) + "px";
    newTile.style.top = (y * tileSize) + "px";
    newTile.style.width = tileSize + "px";
    newTile.style.transform = "rotate(" + rotation * 90 + "deg)";
    newTile.setAttribute('data-x', x);
    newTile.setAttribute('data-y', y);

    camera.appendChild(newTile);

    tiles.push({
        pos: {
            x,
            y
        },
        type,
        rotation
    });
}

const removeTile = function (x, y) {
    let tile = camera.querySelector(".tile[data-x='" + x + "'][data-y='" + y + "']");
    if (tile) {
        tile.remove();
        let index = tiles.findIndex(obj => obj.pos.x == x && obj.pos.y == y);
        tiles.splice(index, 1);
    }
}

const moveCursor = function (x, y) {
    tileCursor.style.left = (x * tileSize) + "px";
    tileCursor.style.top = (y * tileSize) + "px";
}

const getClickPosition = function (event) {
    let x = Math.floor((event.clientX + Math.abs(camera.offsetLeft)) / tileSize);
    let y = Math.floor((event.clientY + Math.abs(camera.offsetTop)) / tileSize);
    return { x, y };
}

const handleClickEvent = function (event) {
    event.preventDefault();

    if ($(event.target).parents('#hotbar').length > 0) {
        return;
    }

    let isRightMB;
    event = event || window.event;

    if ("which" in event) {
        isRightMB = event.which == 3;
    }
    else if ("button" in event) {
        isRightMB = event.button == 2;
    }

    let tilePos = getClickPosition(event);
    if (isRightMB) {
        removeTile(tilePos.x, tilePos.y);
    } else {
        removeTile(tilePos.x, tilePos.y);
        createTile(tilePos.x, tilePos.y);
    }

    return false;
}
document.addEventListener('mousedown', handleClickEvent);

const handleMouseMoveEvent = function (event) {
    if ($(event.target).parents('#hotbar').length > 0) {
        tileCursor.hidden = true;
        return;
    }
    tileCursor.hidden = false;
    lastMouseEvent = event;
    let tilePos = getClickPosition(event);
    moveCursor(tilePos.x, tilePos.y)
}
document.addEventListener('mousemove', handleMouseMoveEvent);

const handleKeyDownEvent = function (event) {
    if (event.keyCode == 37 || event.keyCode == 65) {
        cameraMoving.x = cameraMoveSpeed;
    } else if (event.keyCode == 38 || event.keyCode == 87) {
        cameraMoving.y = cameraMoveSpeed;
    } else if (event.keyCode == 39 || event.keyCode == 68) {
        cameraMoving.x = -cameraMoveSpeed;
    } else if (event.keyCode == 40 || event.keyCode == 83) {
        cameraMoving.y = -cameraMoveSpeed;
    }
}
document.addEventListener('keydown', handleKeyDownEvent);

const handleKeyUpEvent = function (event) {
    if (event.keyCode == 37 || event.keyCode == 65) {
        cameraMoving.x = 0;
    } else if (event.keyCode == 38 || event.keyCode == 87) {
        cameraMoving.y = 0;
    } else if (event.keyCode == 39 || event.keyCode == 68) {
        cameraMoving.x = 0;
    } else if (event.keyCode == 40 || event.keyCode == 83) {
        cameraMoving.y = 0;
    } else if (event.keyCode == 82) {
        rotation++;
        if (rotation > 3) rotation = 0;
        tileCursor.style.transform = "rotate(" + rotation * 90 + "deg)";
    }
}
document.addEventListener('keyup', handleKeyUpEvent);

const scrollingUp = function (event) {
    if (event.wheelDelta) {
        return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
}

const handleScrollEvent = function (event) {
    if (scrollingUp(event)) {
        if (cameraZoom * 1.1 > 2) {
            return;
        }
        cameraZoom = round(cameraZoom * 1.1, 1);
        camera.style.left = ((parseInt(camera.style.left)) * 1.1) + "px";
        camera.style.top = ((parseInt(camera.style.top)) * 1.1) + "px";
    } else {
        if (cameraZoom / 1.1 < 0.5) {
            return;
        }
        cameraZoom = round(cameraZoom / 1.1, 1);
        camera.style.left = ((parseInt(camera.style.left)) / 1.1) + "px";
        camera.style.top = ((parseInt(camera.style.top)) / 1.1) + "px";
    }
    
    tileSize = origTileSize * cameraZoom;

    $('.tile').css('width', tileSize + 'px');
    $('.tile').each(function () {
        let tile = $(this);
        tile.css('left', (tile.data('x') * tileSize) + 'px');
        tile.css('top', (tile.data('y') * tileSize) + 'px');
    });


    handleCameraMovement();
}
document.addEventListener('wheel', handleScrollEvent);

const handleCameraMovement = function () {
    cameraLeft = parseInt(camera.style.left) + cameraMoving.x;
    cameraTop = parseInt(camera.style.top) + cameraMoving.y;

    cameraLeft = cameraLeft > 0 ? 0 : cameraLeft;
    cameraTop = cameraTop > 0 ? 0 : cameraTop;

    cameraLeft = cameraLeft < -((mapSize.x * tileSize) - gameView.clientWidth) ? -((mapSize.x * tileSize) - gameView.clientWidth) : cameraLeft;
    cameraTop = cameraTop < -((mapSize.y * tileSize) - gameView.clientHeight) ? -((mapSize.y * tileSize) - gameView.clientHeight) : cameraTop;

    camera.style.left = cameraLeft + "px";
    camera.style.top = cameraTop + "px";

    handleMouseMoveEvent(lastMouseEvent);
}

const getSelectedHotbarItem = function () {
    return {
        tile: 'conveyor',
        meta: {}
    }
}

let gameLoop = function () {
    handleCameraMovement();
};
setInterval(gameLoop, 1000 / tps);