import { ObjectManager } from './objectManager.js';
import { ColidableI, DamagableI, GameI, GameMapI, ObjectManagerI, PlayerI, RendererI } from './types.js';

let gametimer: NodeJS.Timer;

export class Game implements GameI {
    map: GameMapI;
    player: PlayerI & ColidableI & DamagableI;
    renderer: RendererI;
    objectManager: ObjectManagerI;

    constructor(map: GameMapI, player: PlayerI & ColidableI & DamagableI, renderer: RendererI) {
        this.map = map;
        this.player = player;
        this.renderer = renderer;
        this.objectManager = new ObjectManager([player], []);
    }

    handleCollisions(): void {
        if (this.objectManager.physicalObjects.length < 2) return;
        for (let i = 0; i < this.objectManager.physicalObjects.length; i++) {
            for (let j = i + 1; i < this.objectManager.physicalObjects.length; j++) {
                const colider = this.objectManager.physicalObjects[i];
                const colidee = this.objectManager.physicalObjects[j];
                if (!colider.colides(colidee)) return;
                colider.handleCollision(colidee);
                if (colider.isRemoved) {
                    this.objectManager.physicalObjects.splice(i, 1);
                    i--;
                }
                if (colidee.isRemoved) {
                    this.objectManager.physicalObjects.splice(j, 1);
                    j--;
                }
            }
        }
    }

    start(): void {
        gametimer = setInterval(async () => {
            this.renderer.drawFrame(this.player.position, this.objectManager.drawableObjects);
            this.renderer.drawGun(this.player);
            this.renderer.drawUI(this.player.position, this.player.hp);
            this.player.updatePosition(this.map);
            this.handleCollisions();
            if (this.player.isRemoved) {
                this.stop();
            }
        }, 17);
    }

    stop(): void {
        clearInterval(gametimer);
        alert('Game over');
    }
}