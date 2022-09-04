import Game from '../../game.js';
import Camera from '../camera.js';
import tileClasses from './tiles.js';
import { createItemDrop } from '../items/itemutil.js';

function handleKeyDownEvent(event) {
    if (event.keyCode == 82) {
        Game.rotation++;
        if (Game.rotation > 3) Game.rotation = 0;
        Game.tileCursor.style.transform = "rotate(" + Game.rotation * 90 + "deg)";
    }
}
document.addEventListener('keydown', handleKeyDownEvent);

export function createTile(x, y) {
    if (x >= Game.mapSize.x || y >= Game.mapSize.y) {
        return;
    }

    if (camera.querySelector(".tile[data-x='" + x + "'][data-y='" + y + "']")) {
        return;
    }

    let type = getSelectedHotbarItem();
    let clone = Game.templates[type.tile].content.cloneNode(true);
    let newTile = clone.querySelector(".tile");

    newTile.style.left = (x * Game.tileSize) + "px";
    newTile.style.top = (y * Game.tileSize) + "px";
    newTile.style.width = Game.tileSize + "px";
    newTile.style.transform = "rotate(" + Game.rotation * 90 + "deg)";
    newTile.setAttribute('data-x', x);
    newTile.setAttribute('data-y', y);

    Game.camera.appendChild(newTile);

    let tileObj = new tileClasses[type.tile](x, y, Game.rotation, type.meta);
    if (window.addItem) {
        let item = createItemDrop(x, y, 16, 16, 'conveyor', null, false)
        let item2 = createItemDrop(x, y, 16, 16, 'conveyor', null, false)
        tileObj.addItem(item, 0, 0);
        tileObj.addItem(item2, 0, 1);
    }
    Game.tiles.push(tileObj);
}

export function removeTile(x, y) {
    let tile = Game.camera.querySelector(".tile[data-x='" + x + "'][data-y='" + y + "']");
    if (tile) {
        tile.remove();
        let index = Game.tiles.findIndex(obj => obj.pos.x == x && obj.pos.y == y);
        Game.tiles.splice(index, 1);
    }
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

    let tilePos = Camera.getClickPosition(event.clientX, event.clientY);
    if (isRightMB) {
        removeTile(tilePos.x, tilePos.y);
    } else {
        removeTile(tilePos.x, tilePos.y);
        createTile(tilePos.x, tilePos.y);
    }

    return false;
}
document.addEventListener('mousedown', handleClickEvent);

export default {createTile, removeTile};