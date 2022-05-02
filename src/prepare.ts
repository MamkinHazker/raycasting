import { GameI } from './types.js';

export function prepareDocument(canvas: HTMLCanvasElement, game: GameI) {
    let lock = false;
    document.addEventListener('keydown', (e) => {
        let key = e.key || e.keyCode;
        switch (key) {
        case 87:
            debugger;
            game.player.movingForward = true;
            break;
        case 83:
            game.player.movingBack = true;
            break;
        case 68:
            game.player.movingRight = true;
            break;
        case 65:
            game.player.movingLeft = true;
            break;
        case 16:
            game.player.isRunning = true;
            break;
        }
    });

    document.addEventListener('keyup', (e) => {
        let key = e.key || e.keyCode;
        switch (key) {
        case 87:
            game.player.movingForward = false;
            break;
        case 83:
            game.player.movingBack = false;
            break;
        case 68:
            game.player.movingRight = false;
            break;
        case 65:
            game.player.movingLeft = false;
            break;
        case 16:
            game.player.isRunning = false;
            break;
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (e.button == 0) game.player.startAttacking();
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button == 0) game.player.stopAttacking();
    });

    document.addEventListener('mousemove', (e) => {
        if (e.movementX > 300 || e.movementX < -300) return;
        game.player.updateAngle(e.movementX);
    });

    document.addEventListener('pointerlockchange', (event) => {
        lock = !lock;
    });

    canvas.onclick = function () {
        if (!lock) canvas.requestPointerLock();
    };
}
