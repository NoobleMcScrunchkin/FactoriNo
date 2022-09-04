import Game from '../../game.js';
import Item from './item.js';

export function createItemDrop(x, y, tileX, tileY, type, meta, ground = true) {
    if (x >= Game.mapSize.x || y >= Game.mapSize.y) {
        return;
    }

    x += tileX / 32;
    y += tileY / 32;

    let clone = Game.templates[type].content.cloneNode(true);
    let newTile = clone.querySelector(".tile");

    newTile.style.left = (x * Game.tileSize) + "px";
    newTile.style.top = (y * Game.tileSize) + "px";
    newTile.style.width = Game.itemSize + "px";
    newTile.classList.add('item');
    newTile.setAttribute('data-x', x);
    newTile.setAttribute('data-y', y);

    Game.camera.appendChild(newTile);

    let itemObj = new Item(x, y, type, meta);
    
    if (ground) {
        Game.items.push(itemObj);
    }

    return {
        item: itemObj,
        dom: newTile
    };
}

export default {createItemDrop};