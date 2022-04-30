import { ColidableI, DamagableI, GameMapI, GunI, isDamaging, PlayerI, Position } from './types';

let attackingTimer: number;

export class Player implements DamagableI, ColidableI, PlayerI {
    discriminator: 'Damagable' = 'Damagable';
    hp = 100;
    movingForward = false;
    movingBack = false;
    movingRight = false;
    movingLeft = false;
    isRunning = false;
    position: Position;
    gun: GunI | undefined;

    get isRemoved(): boolean {
        return this.hp > 0;
    }

    constructor(position: Position, gun?: GunI) {
        this.position = position;
        if (gun) {
            this.gun = gun;
        }
    }

    get isMoving() {
        return this.movingForward || this.movingBack || this.movingLeft || this.movingRight;
    }

    takeWeapon(gun: GunI) {
        this.gun = gun;
    }

    updatePosition(map: GameMapI) {
        let speed = .1;
        if (this.isRunning) speed *= 1.3;
        if (this.movingForward) {
            this.position.x += Math.sin(this.position.angle) * speed;
            this.position.y += Math.cos(this.position.angle) * speed;
            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {
                this.position.x -= Math.sin(this.position.angle) * speed;
                this.position.y -= Math.cos(this.position.angle) * speed;
            }
        }
        if (this.movingBack) {
            this.position.x -= Math.sin(this.position.angle) * speed;
            this.position.y -= Math.cos(this.position.angle) * speed;
            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {
                this.position.x += Math.sin(this.position.angle) * speed;
                this.position.y += Math.cos(this.position.angle) * speed;
            }
        }
        if (this.movingRight) {
            this.position.x += (Math.cos(this.position.angle) * speed) / 2;
            this.position.y -= (Math.sin(this.position.angle) * speed) / 2;
            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {
                this.position.x -= (Math.cos(this.position.angle) * speed) / 2;
                this.position.y += (Math.sin(this.position.angle) * speed) / 2;
            }
        }
        if (this.movingLeft) {
            this.position.x -= (Math.cos(this.position.angle) * speed) / 2;
            this.position.y += (Math.sin(this.position.angle) * speed) / 2;
            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {
                this.position.x += (Math.cos(this.position.angle) * speed) / 2;
                this.position.y -= (Math.sin(this.position.angle) * speed) / 2;
            }
        }
    }

    updateAngle(movementX: number) {
        this.position.angle = this.position.angle + movementX * .001;
        if (this.position.angle < -Math.PI) this.position.angle += Math.PI * 2;
        else if (this.position.angle > Math.PI) this.position.angle -= Math.PI * 2;
    }

    startAttacking() {
        attackingTimer = setInterval(() => { this.gun?.fire(this.position); }, 17);
    }

    stopAttacking() {
        clearInterval(attackingTimer);
    }

    takeDamage(damage: number): void {
        this.hp -= damage;
        if (this.hp < 0) this.hp = 0;
    }

    colides(colidee: ColidableI): boolean {
        return this.position.x == colidee.position.x && this.position.y == colidee.position.y;
    }

    handleCollision(colidee: ColidableI): void {
        if (isDamaging(colidee)) {
            colidee.dealDamage(this);
        }
    }
}