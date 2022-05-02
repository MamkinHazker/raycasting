import { GameI } from './types.js';

export function prepareDocument(canvas: HTMLCanvasElement, game: GameI) {
    let lock = false;
    document.addEventListener('keydown', (e) => {
        let key = e.code;
        switch (key) {
        case 'KeyW':
            game.player.movingForward = true;
            break;
        case 'KeyS':
            game.player.movingBack = true;
            break;
        case 'KeyD':
            game.player.movingRight = true;
            break;
        case 'KeyA':
            game.player.movingLeft = true;
            break;
        case 'ShiftLeft':
            game.player.isRunning = true;
            break;
        }
    });

    document.addEventListener('keyup', (e) => {
        let key = e.code;
        switch (key) {
        case 'KeyW':
            game.player.movingForward = false;
            break;
        case 'KeyS':
            game.player.movingBack = false;
            break;
        case 'KeyD':
            game.player.movingRight = false;
            break;
        case 'KeyA':
            game.player.movingLeft = false;
            break;
        case 'ShiftLeft':
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
