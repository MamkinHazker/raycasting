import { Sprite } from './sprite'
import { PlayerI } from './types';

const canvas = (document.getElementById('canvas') as HTMLCanvasElement);
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
const height = canvas.height
const width = canvas.width
const lessSide = (height < width) ? height : width

const enemy = new Image(height / 1.5 * .638, height / 1.5)
enemy.src = "./static/src/img/enemy.png"
const pistol = new Image()
pistol.src = "./static/src/img/glock.png"
const bullet = new Image()
bullet.src = "./static/src/img/bullet.png"

const ctx = canvas.getContext('2d')

type PixelSize = {
    x: number,
    y: number
};

interface GameMapI {
    value: string[];
    get height(): number;
    get width(): number;
}

class Game {

}

class Player implements PlayerI {
    hp = 100
    movingForward = false;
    movingBack = false;
    movingRight = false;
    movingLeft = false;
    isRunning = false;
    playerX: number;
    playerY: number;
    playerAng: number;
    gun: any;

    constructor(x, y, angle, gun) {
        this.playerX = x
        this.playerY = y
        this.playerAng = angle
        this.gun = gun
    }

    get isMoving() {
        return this.movingForward || this.movingBack || this.movingLeft || this.movingRight
    }

    updatePosition() {
        let speed = .1
        if (this.isRunning) speed *= 1.3
        if (this.movingForward) {
            this.playerX += Math.sin(this.playerAng) * speed
            this.playerY += Math.cos(this.playerAng) * speed
            if (map[Math.floor(this.playerX)][Math.floor(this.playerY)] == '#') {
                this.playerX -= Math.sin(this.playerAng) * speed
                this.playerY -= Math.cos(this.playerAng) * speed
            }
        }
        if (this.movingBack) {
            this.playerX -= Math.sin(this.playerAng) * speed
            this.playerY -= Math.cos(this.playerAng) * speed
            if (map[Math.floor(this.playerX)][Math.floor(this.playerY)] == '#') {
                this.playerX += Math.sin(this.playerAng) * speed
                this.playerY += Math.cos(this.playerAng) * speed
            }
        }
        if (this.movingRight) {
            this.playerX += (Math.cos(this.playerAng) * speed) / 2
            this.playerY -= (Math.sin(this.playerAng) * speed) / 2
            if (map[Math.floor(this.playerX)][Math.floor(this.playerY)] == '#') {
                this.playerX -= (Math.cos(this.playerAng) * speed) / 2
                this.playerY += (Math.sin(this.playerAng) * speed) / 2
            }
        }
        if (this.movingLeft) {
            this.playerX -= (Math.cos(this.playerAng) * speed) / 2
            this.playerY += (Math.sin(this.playerAng) * speed) / 2
            if (map[Math.floor(this.playerX)][Math.floor(this.playerY)] == '#') {
                this.playerX += (Math.cos(this.playerAng) * speed) / 2
                this.playerY -= (Math.sin(this.playerAng) * speed) / 2
            }
        }
    }

    updateAngle(movementX: number) {
        this.playerAng = this.playerAng + movementX * .001
        if (this.playerAng < -Math.PI) this.playerAng += Math.PI * 2
        else if (this.playerAng > Math.PI) this.playerAng -= Math.PI * 2
    }

    startAttacking() {

    }
    stopAttacking() {

    }
}

class Enemy {
    hp = 100;
    sprite = enemy;
    z = -5;
    gun = new Pistol();
    posX: number;
    posY: number;
    angle: number;

    constructor(posX, posY, angle) {
        this.posX = posX
        this.posY = posY
        this.angle = angle
        setInterval(() => this.walk(), 15)
        setInterval(() => this.updateAng(), Math.random() * 1000)
        setInterval(() => this.fireBullet(), this.gun.fireRate + 100)
    }

    walk() {
        const speed = .05
        this.posX += Math.sin(this.angle) * speed
        this.posY += Math.cos(this.angle) * speed
        if (map[Math.floor(this.posX)][Math.floor(this.posY)] == '#') {
            this.posX -= Math.sin(this.angle) * speed
            this.posY -= Math.cos(this.angle) * speed
            this.angle = Math.random() * Math.PI * 2 - Math.PI
        }
    }
    updateAng() {
        this.angle = Math.random() * Math.PI * 2 - Math.PI
    }

    fireBullet() {
        this.gun.fireBullet(Math.atan2(player.playerX - this.posX, player.playerY - this.posY), this.posX, this.posY)
    }
}

class Bullet {
    sprite = bullet
    z = height * .47
    damage: number;
    angle: number;
    posX: number;
    posY: number;
    constructor(damage, angle, posX, posY) {
        this.damage = damage
        this.angle = angle
        this.posX = posX + Math.sin(this.angle) * .5
        this.posY = posY + Math.cos(this.angle) * .5
        setInterval(() => this.updatePosition(), 1)
    }
    updatePosition() {
        this.posX += Math.sin(this.angle) * .4
        this.posY += Math.cos(this.angle) * .4
    }
}

class SemiAuto {
    damage = 100
    lastBullet = 0
    fireRate = 200
    fireBullet(playerAng, playerX, playerY) {
        if (Date.now() - this.lastBullet < this.fireRate) return;
        game.addObject(new Bullet(this.damage, playerAng, playerX, playerY))
        this.lastBullet = Date.now()
    }
}

class Auto {
    damage = 100
    lastBullet = 0
    fireRate = 200
    fireBullet(playerAng, playerX, playerY) {
        if (Date.now() - this.lastBullet < this.fireRate) return;
        game.addObject(new Bullet(this.damage, playerAng, playerX, playerY))
        this.lastBullet = Date.now()
    }
}

class Pistol extends SemiAuto {
    damage = 25
    sprite = new Sprite(pistol, 430, 500, 3)
    fireRate = 150
    fireBullet(playerAng, playerX, playerY) {
        if (Date.now() - this.lastBullet < this.fireRate) return;
        game.addObject(new Bullet(this.damage, playerAng, playerX, playerY))
        this.lastBullet = Date.now()
        let timer = setInterval(() => this.sprite.switchFrame(), this.fireRate / this.sprite.framesCount)
        setTimeout(() => clearInterval(timer), 151)
    }
}

class Riffle extends Auto {
    damage = 25
    sprite = new Sprite(pistol, 430, 500, 3)
    fireBullet(playerAng, playerX, playerY) {
        if (Date.now() - this.lastBullet < this.fireRate) return;
        game.addObject(new Bullet(this.damage, playerAng, playerX, playerY))
        this.lastBullet = Date.now()
        let timer = setInterval(() => {
            if (this.sprite.currentFrame == this.sprite.framesCount - 1) {
                clearInterval(timer);
            }
            this.sprite.switchFrame()
        }, this.fireRate / this.sprite.framesCount)
    }
}

class GameMap implements GameMapI {
    value: string[];
    get height(): number {
        return this.value[0].length;
    }

    get width(): number {
        return this.value.length;
    }

    constructor(value: string[]) {
        this.value = value;
    }
}

const map: GameMap = new GameMap(
    [
        '#############',
        '#...........#',
        '#...........#',
        '#...........#',
        '#...#####...#',
        '#...#...##..#',
        '#...#...#...#',
        '#...##.##...#',
        '#...........#',
        '#...........#',
        '#########.###',
        '#...........#',
        '#...........#',
        '#...........#',
        '#############',
    ]
);

const player = new Player(3.0, 3.0, .0, new Riffle())
const game = new Game(400, Math.PI * (104 / 360), 20, player, map)
//setInterval(() => game.addObject(new Enemy(3, 8, .0)), 3000)
game.start()

document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
        case 87:
            player.movingForward = true
            break
        case 83:
            player.movingBack = true
            break
        case 68:
            player.movingRight = true
            break
        case 65:
            player.movingLeft = true
            break
        case 16:
            player.isRunning = true
            break
    }
})
