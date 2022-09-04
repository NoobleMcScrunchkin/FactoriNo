const round = function (value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const scrollingUp = function (event) {
    if (event.wheelDelta) {
        return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
}

const getSelectedHotbarItem = function () {
    return {
        tile: 'conveyor',
        meta: {
            speedMultiplier: 1
        }
    }
}

window.addItem = false;