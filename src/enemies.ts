import { Sprite } from "./sprite";
import { ColidableI, DamagableI, DrawableI, GameMapI, isDamaging, Position } from "./types";


const enemy = new Image(900);
enemy.src = "./static/src/img/enemy.png";

class Enemy implements DrawableI, DamagableI, ColidableI {
    discriminator: "Damagable";
    hp = 100;
    sprite = new Sprite(enemy);
    z = -5;
    position: Position;
    get isRemoved(): boolean {
        return this.hp > 0;
    }

    constructor(posittion: Position, map: GameMapI) {
        this.position = posittion;
        setInterval(() => this.walk(map), 15);
        setInterval(() => this.updateAng(), Math.random() * 1000);
        //setInterval(() => this.fireBullet(), this.gun.fireRate + 100)
    }

    walk(map: GameMapI) {
        const speed = .05
        this.position.x += Math.sin(this.position.angle) * speed
        this.position.y += Math.cos(this.position.angle) * speed
        if (map[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {
            this.position.x -= Math.sin(this.position.angle) * speed
            this.position.y -= Math.cos(this.position.angle) * speed
            this.position.angle = Math.random() * Math.PI * 2 - Math.PI
        }
    }

    updateAng() {
        this.position.angle = Math.random() * Math.PI * 2 - Math.PI
    }

    fireBullet() {
        //this.gun.fireBullet(Math.atan2(player.playerX - this.position.x, player.playerY - this.position.y), this.position.x, this.position.y)
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