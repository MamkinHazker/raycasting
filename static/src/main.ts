import { Sprite } from './sprite'
import { PlayerI } from './types';

const canvas = (document.getElementById('canvas') as HTMLCanvasElement);
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
const height = canvas.height
const width = canvas.width
const lessSide = (height < width) ? height : width

const wall = new Image()
wall.src = "./static/src/img/wall.jpg"
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
    objects = [];
    resX: number;
    resY: number;
    pixelSize: PixelSize;
    FOV: number;
    depth: number;
    player: PlayerI;
    map: GameMap;
    game: number;
    constructor(resolutionX, fov, depth, player, map) {
        this.resX = resolutionX
        this.resY = this.resX * (height / width)
        this.pixelSize = { x: width / this.resX, y: height / this.resY }
        this.FOV = fov
        this.depth = depth
        this.player = player
        this.map = map
    }

    start() {
        this.game = setInterval(() => this.draw(), 15)
    }

    async draw() {
        this.player.updatePosition()
        this.drawRect(0, 0, height / 2, '#A9A9A9')
        this.drawRect(0, height / 2, height / 2, '#696969')
        const DepthBufer = []
        for (let x = 0; x < this.resX; x++) {
            const rayAngle = this.player.playerAng - this.FOV / 2 + (x / this.resX) * this.FOV
            let distanceToTheWall = .0

            const eyeX = Math.sin(rayAngle)
            const eyeY = Math.cos(rayAngle)

            let textureStartPoint;

            while (distanceToTheWall < this.depth) {
                distanceToTheWall += .06

                const testX = (this.player.playerX + eyeX * distanceToTheWall)
                const testY = (this.player.playerY + eyeY * distanceToTheWall)
                const nTestX = Math.floor(testX)
                const nTestY = Math.floor(testY)
                if (this.map[nTestX][nTestY] == '#') {
                    const testAngle = Math.abs(Math.atan2(testY - (nTestY + .5), testX - (nTestX + .5)))
                    if (testAngle > Math.PI * .75 || testAngle < Math.PI * .25)
                        textureStartPoint = testY - nTestY
                    else
                        textureStartPoint = testX - nTestX
                    break;
                }
                else if (nTestX < 0 || testX >= this.map.width || nTestY < 0 || testY >= this.map.height) {
                    distanceToTheWall = this.depth
                    break;
                }
            }
            const ceiling = height / 2 - height / distanceToTheWall
            const floor = height - ceiling
            this.drawTexture(x * this.pixelSize[0], ceiling, floor - ceiling, textureStartPoint)
            DepthBufer[x] = distanceToTheWall
        }
        main: for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i]) {
                const posX = this.objects[i].posX
                const posY = this.objects[i].posY
                const nPosX = Math.floor(posX)
                const nPosY = Math.floor(posY)
                if (this.objects[i] instanceof Bullet) {
                    for (let j = 0; j < this.objects.length; j++) {
                        const obj = this.objects[j]
                        if (obj && obj instanceof Enemy && Math.abs(obj.posX - posX) <= .25 && Math.abs(obj.posY - posY) <= .25) {
                            obj.hp -= this.objects[i].damage
                            if (obj.hp <= 0) {
                                this.objects[j].remove = true
                                this.objects[j] = undefined;
                            }
                            this.objects[i] = undefined
                            continue main;
                        }
                    }
                    if (Math.abs(this.player.playerX - posX) <= .25 && .25 && Math.abs(this.player.playerY - posY) <= .25) {
                        this.player.hp -= this.objects[i].damage
                        if (this.player.hp <= 0) {
                            this.player.hp = 0
                            this.stop()
                        }
                    }
                }
                if (this.map[nPosX][nPosY] == '#' || nPosX >= this.map.width || nPosX < 0 || nPosY >= this.map.height || nPosY < 0) {
                    this.objects[i] = undefined
                    continue;
                }
                let angle = Math.atan2(posX - this.player.playerX, posY - this.player.playerY) - this.player.playerAng
                if (angle < -Math.PI) angle += Math.PI * 2
                else if (angle > Math.PI) angle -= Math.PI * 2
                const distance = Math.sqrt((posY - this.player.playerY) ** 2 + (posX - this.player.playerX) ** 2)
                if (Math.abs(angle) > this.FOV / 2 || distance > this.depth) continue;
                const image = this.objects[i].sprite
                const objHeight = 2 * image.height / distance
                const objWidth = objHeight / image.height * image.width
                const x = width * ((angle + this.FOV / 2) / this.FOV)
                if (DepthBufer[Math.round(x / this.pixelSize[0])] < distance) continue;
                const z = (height / (height - this.objects[i].z + image.height)) * this.objects[i].z
                const y = height - (height / 2 - height / distance) - z / distance
                this.drawObject(image, x - objWidth / 2, y - objHeight, objWidth, objHeight)
            }
        }
        this.drawMap()
        this.drawGun()
        this.drawHp()
    }
    drawMap() {
        const mapLessSide = (this.map.height < this.map.width) ? this.map.height : this.map.width
        const mapSize = lessSide / 4
        const pixel = mapSize / mapLessSide
        ctx.fillStyle = "#FFF"
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                if (this.map[i][j] == '#')
                    ctx.fillRect(mapSize - i * pixel + 15, j * pixel, pixel, pixel)
            }
        }
        ctx.fillStyle = "red"
        const playerX = mapSize - this.player.playerX * pixel + 35
        const playerY = this.player.playerY * pixel
        ctx.beginPath()
        ctx.moveTo(playerX, playerY)
        const FOVRightSideX = Math.sin(-this.player.playerAng - this.FOV / 2) * 50
        const FOVRightSideY = Math.cos(-this.player.playerAng - this.FOV / 2) * 50
        ctx.lineTo(playerX + FOVRightSideX, playerY + FOVRightSideY)
        ctx.moveTo(playerX, playerY)
        const FOVLeftSideX = Math.sin(-this.player.playerAng + this.FOV / 2) * 50
        const FOVLeftSideY = Math.cos(-this.player.playerAng + this.FOV / 2) * 50
        ctx.lineTo(playerX + FOVLeftSideX, playerY + FOVLeftSideY)
        ctx.strokeStyle = "red"
        ctx.stroke()
        ctx.fillRect(playerX - 5, playerY - 5, 10, 10)
    }
    drawRect(x, y, height, color) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, width, height)
    }
    drawTexture(x, y, height, startPos) {
        ctx.drawImage(wall, wall.width * startPos, 0, this.pixelSize[0], wall.height, x, y, this.pixelSize[0], height);
    }
    drawObject(sprite, x, y, objWidth, objHeight) {
        ctx.drawImage(sprite, x, y, objWidth, objHeight)
    }
    drawGun() {
        const ratio = (this.player.isRunning) ? 60 : 100
        const bias = (this.player.isMoving) ? Math.cos(Date.now() / ratio) * (30 * (100 / ratio)) : 0
        const { sx, sy, sWidth, sHeight } = this.player.gun.sprite.getFrame();
        let gunSize = width / 4;
        ctx.drawImage(this.player.gun.sprite.sprite, sx, sy, sWidth, sHeight, width / 2 - gunSize / 2 + bias, height - gunSize, gunSize, gunSize)
    }
    drawHp() {
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.strokeRect(width - 321, 19, 302, 22)
        ctx.lineWidth = 1
        ctx.fillStyle = "red"
        ctx.fillRect(width - 320, 20, this.player.hp / 100 * 300, 20)
    }
    stop() {
        alert("Игра окончена")
        clearInterval(this.game)
    }
    addObject(object) {
        this.objects.push(object)
    }
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
