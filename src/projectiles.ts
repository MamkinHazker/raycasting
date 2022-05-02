
import { Sprite } from './sprite.js';
import { ColidableI, DamagableI, DamagingI, DrawableI, isDamagable, Position } from './types.js';

const bullet = new Image();
bullet.src = './img/bullet.png';

export class Bullet implements DrawableI, DamagingI, ColidableI {
    physicalDiscriminator: 'Physical' = 'Physical';
    drawableDiscriminator: 'Drawable' = 'Drawable'
    discriminator: 'Damaging' = 'Damaging';
    sprite = new Sprite(bullet);
    z = .4;
    damage: number;
    position: Position;
    isColided = false;

    get isRemoved(): boolean {
        return this.isColided;
    }

    constructor(damage: number, position: Position) {
        this.damage = damage;
        this.position = {
            x: position.x + Math.sin(position.angle) * .5,
            y: position.y + Math.cos(position.angle) * .5,
            angle: position.angle
        }
        setInterval(() => this.updatePosition(), 1);
    }

    updatePosition() {
        this.position.x += Math.sin(this.position.angle) * .5;
        this.position.y += Math.cos(this.position.angle) * .5;
    }

    dealDamage(to: DamagableI) {
        to.takeDamage(this.damage);
        this.isColided = true;
    }

    colides(colidee: ColidableI): boolean {
        return this.position.x == colidee.position.x && this.position.y == colidee.position.y;
    }

    handleCollision(colidee: ColidableI): void {
        if (isDamagable(colidee)) {
            this.dealDamage(colidee);
        }
    }
}