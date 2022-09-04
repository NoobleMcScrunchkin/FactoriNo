export default class Item {
    constructor(x, y, type, meta) {
        this.pos = {
            x,
            y
        };
        this.type = type;
        this.meta = meta;
    }
}