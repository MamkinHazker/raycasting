import { Bullet } from './projectiles.js';
import { AnimatedSprite } from './sprite.js';
import { GunI, PhysycalObjectManagerI, Position } from './types.js';

const pistol = new Image();
pistol.src = './static/src/img/glock.png';


class Auto implements GunI{
    damage: number;
    fireRate: number;
    canShoot: boolean;
    physicalObjectManager: PhysycalObjectManagerI;
    sprite: AnimatedSprite = new AnimatedSprite(pistol, 430, 500, 3);

    fire(position: Position): void {
        if(!this.canShoot) return;
        this.physicalObjectManager.push(new Bullet(this.damage, position));
        this.canShoot = false;
        this.sprite.playAnimation(this.fireRate);
        setTimeout(() => this.canShoot = true, this.fireRate);
    }

    constructor() {
        this.damage = 0;
        this.fireRate = 100;
        this.canShoot = false;
        this.physicalObjectManager = [];
    }
}

export class AK_47 extends Auto implements GunI { 
    damage = 100;
    fireRate = 200;
    canShoot = true;
    physicalObjectManager: PhysycalObjectManagerI;

    constructor(physicalObjectManager: PhysycalObjectManagerI) {
        super();
        this.physicalObjectManager = physicalObjectManager;
    }
}