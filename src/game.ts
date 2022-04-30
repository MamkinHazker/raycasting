import { ColidableI, DamagableI, DrawableObjectManagerI, GameI, GameMapI, PhysycalObjectManagerI, PlayerI, RendererI } from './types';

let gametimer: number;

export class Game implements GameI {
    map: GameMapI;
    player: PlayerI & ColidableI & DamagableI;
    renderer: RendererI;
    physicalObjects: PhysycalObjectManagerI;
    drawableObjects: DrawableObjectManagerI;

    constructor(map: GameMapI, player: PlayerI & ColidableI & DamagableI, renderer: RendererI) {
        this.map = map;
        this.player = player;
        this.renderer = renderer;
        this.physicalObjects = [];
        this.drawableObjects = [];
    }

    handleCollisions(): void {
        this.physicalObjects.push(this.player);
        for (let i = 0; i < this.physicalObjects.length; i++) {
            for (let j = i; i < this.physicalObjects.length; j++) {
                const colider = this.physicalObjects[i];
                const colidee = this.physicalObjects[j];
                if (!colider.colides(colidee)) return;
                colider.handleCollision(colidee);
                if (colider.isRemoved) {
                    this.physicalObjects.splice(i, 1);
                    i--;
                }
                if (colidee.isRemoved) {
                    this.physicalObjects.splice(j, 1);
                    j--;
                }
            }
        }
        this.physicalObjects.pop();
    }

    start(): void {
        gametimer = setInterval(() => {
            this.renderer.drawFrame(this.player.position, this.drawableObjects);
            this.renderer.drawGun(this.player);
            this.renderer.drawUI(this.player.position, this.player.hp);
            if (this.player.isRemoved) this.stop();
        }, 17);
    }

    stop(): void {
        clearInterval(gametimer);
        alert('Game over');
    }
}