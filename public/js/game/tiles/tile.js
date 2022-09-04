export default class Tile {
    pos = {
        x: 0,
        y: 0
    };
    rotation = 0;

    constructor(x, y, rotation) {
        this.pos.x = x;
        this.pos.y = y;
        this.rotation = rotation;
    }

    tickUpdate() {
        return;
    }
}