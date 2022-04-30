
import { Sprite } from './sprite';
import { ColidableI, DamagableI, DamagingI, DrawableI, isDamagable, Position } from './types';

const bullet = new Image();
bullet.src = './static/src/img/bullet.png';

export class Bullet implements DrawableI, DamagingI, ColidableI {
    discriminator: 'Damaging' = 'Damaging';
    sprite = new Sprite(bullet);
    z: number;
    damage: number;
    position: Position;
    isColided = true;

    get isRemoved(): boolean {
        return this.isColided;
    }

    constructor(damage, position) {
        this.damage = damage
        position.x = position.x + Math.sin(position.angle) * .5
        position.y = position.y + Math.cos(position.angle) * .5
        this.position = position;
        setInterval(() => this.updatePosition(), 1)
    }

    updatePosition() {
        this.position.x += Math.sin(this.position.angle) * .4
        this.position.y += Math.cos(this.position.angle) * .4
    }

    dealDamage(to: DamagableI) {
        to.takeDamage(this.damage);
        this.isColided = true;
    }

    colides(colidee: ColidableI): boolean {
        return this.position.x == colidee.position.x && this.position.y == colidee.position.y;
    }

    handleCollision(colidee: ColidableI): void {
        if(isDamagable(colidee)) {
            this.dealDamage(colidee);
        }
    }
}