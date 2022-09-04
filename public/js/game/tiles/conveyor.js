import Tile from './tile.js';
import Item from '../items/item.js';
import Game from '../../game.js';

const beltSpeed = 0.5;

export default class Conveyor extends Tile {
    carryingItems = [];
    beltSpeed = beltSpeed;

    constructor(x, y, rotation, meta) {
        super(x, y, rotation);

        if (meta) {
            if (meta.speedMultiplier) {
                this.beltSpeed = beltSpeed * meta.speedMultiplier;
            }
        }

        switch (rotation) {
            case 0:
                this.nextPos = {
                    x,
                    y: y - 1
                }
                break;
            case 1:
                this.nextPos = {
                    x: x + 1,
                    y
                }
                break;
            case 2:
                this.nextPos = {
                    x,
                    y: y + 1
                }
                break;
            case 3:
                this.nextPos = {
                    x: x - 1,
                    y
                }
                break;
            default:
                break;
        }
    }

    tickUpdate() {
        let itemsToRemove = [];

        this.carryingItems.forEach((curItem, index) => {
            curItem.progress += this.beltSpeed;

            if (curItem.progress >= 31) {
                curItem.progress = 31;
                let conveyor = Game.tiles.find(obj => obj.pos.x == this.nextPos.x && obj.pos.y == this.nextPos.y);

                if (conveyor && conveyor.constructor.name == "Conveyor") {
                    conveyor.addItem(curItem.itemObj, 0, curItem.side);
                    itemsToRemove.push(index);
                }

                return;
            }

            this.updateItemPos(index);
        });

        itemsToRemove.sort();
        itemsToRemove.reverse();

        itemsToRemove.forEach(index => {
            this.carryingItems.splice(index, 1);
        });
    }

    addItem(itemObj, progress = 0, side = 0) {
        let i = this.carryingItems.push({
            itemObj,
            progress,
            side,
        }) - 1;

        this.updateItemPos(i);
    }

    updateItemPos(i) {
        let itemObj = this.carryingItems[i].itemObj;
        let progress = this.carryingItems[i].progress;
        let side = this.carryingItems[i].side;

        let item = itemObj.item;
        let dom = itemObj.dom;

        switch (this.rotation) {
            case 0:
                if (!side) {
                    item.pos.x = this.pos.x + 2 / 32;
                    item.pos.y = this.pos.y + (1 - progress / 32) - (8 / 32);
                } else {
                    item.pos.x = this.pos.x + 1 - 14 / 32;
                    item.pos.y = this.pos.y + (1 - progress / 32) - (8 / 32);
                }
                break;
            case 1:
                if (!side) {
                    item.pos.x = this.pos.x + (progress / 32) - (8 / 32);
                    item.pos.y = this.pos.y + 2 / 32;
                } else {
                    item.pos.x = this.pos.x + (progress / 32) - (8 / 32);
                    item.pos.y = this.pos.y + 1 - 14 / 32;
                }
                break;
            case 2:
                if (!side) {
                    item.pos.x = this.pos.x + 1 - 14 / 32;
                    item.pos.y = this.pos.y + (progress / 32) - (8 / 32);
                } else {
                    item.pos.x = this.pos.x + 2 / 32;
                    item.pos.y = this.pos.y + (progress / 32) - (8 / 32);
                }
                break;
            case 3:
                if (!side) {
                    item.pos.x = this.pos.x + (1 - progress / 32) - (8 / 32);
                    item.pos.y = this.pos.y + 1 - 14 / 32;
                } else {
                    item.pos.x = this.pos.x + (1 - progress / 32) - (8 / 32);
                    item.pos.y = this.pos.y + 2 / 32;
                }
                break;
            default:
                break;
        }

        dom.style.left = (item.pos.x * Game.tileSize) + "px";
        dom.style.top = (item.pos.y * Game.tileSize) + "px";
        dom.setAttribute('data-x', item.pos.x);
        dom.setAttribute('data-y', item.pos.y);
    }
}