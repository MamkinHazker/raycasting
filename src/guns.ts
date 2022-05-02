import { ObjectManager } from './objectManager.js';
import { Bullet } from './projectiles.js';
import { AnimatedSprite } from './sprite.js';
import { GunI, ObjectManagerI, Position } from './types.js';

const pistol = new Image();
pistol.src = './img/glock.png';


class Auto implements GunI{
    damage: number;
    fireRate: number;
    canShoot: boolean;
    objectManager: ObjectManagerI;
    sprite: AnimatedSprite = new AnimatedSprite(pistol, 430, 500, 3);

    fire(position: Position): void {
        if(!this.canShoot) return;
        this.objectManager.push(new Bullet(this.damage, position));
        this.canShoot = false;
        this.sprite.playAnimation(this.fireRate);
        setTimeout(() => this.canShoot = true, this.fireRate);
    }

    constructor() {
        this.damage = 0;
        this.fireRate = 100;
        this.canShoot = false;
        this.objectManager = new ObjectManager([], []);
    }
}

export class AK_47 extends Auto implements GunI { 
    damage = 100;
    fireRate = 200;
    canShoot = true;
    objectManager: ObjectManagerI;

    constructor(objectManager: ObjectManagerI) {
        super();
        this.objectManager = objectManager;
    }
}