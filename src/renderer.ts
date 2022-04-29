import { Sprite } from './sprite';
import { Position, RendererI, GameMapI, PixelSize } from './types';

const wall = new Image()
wall.src = './static/src/img/wall.jpg'

export class Renderer implements RendererI {
    map: GameMapI;
    ctx: CanvasRenderingContext2D;
    resolution: { x: number; y: number };
    pixelSize: PixelSize;
    height: number;
    width: number;
    FOV: number;
    depth = 16;

    constructor(map: GameMapI, ctx: CanvasRenderingContext2D, resolution: { x: number; y: number }, pixelSize: PixelSize, FOV: number) {
        this.map = map;
        this.ctx = ctx;
        this.resolution = resolution;
        this.pixelSize = pixelSize;
        this.height = this.ctx.canvas.height;
        this.width = this.ctx.canvas.width;
        this.FOV = FOV;
    }

    drawFrame(position: Position, objects: Objects[]): void {
        this.drawRect(0, 0, this.height / 2, '#A9A9A9');
        this.drawRect(0, this.height / 2, this.height / 2, '#696969');
        const DepthBufer = [];
        for (let x = 0; x < this.resolution.x; x++) {
            const rayAngle =
                position.angle - this.FOV / 2 + (x / this.resolution.x) * this.FOV;
            let distanceToTheWall = 0.0;

            const eyeX = Math.sin(rayAngle);
            const eyeY = Math.cos(rayAngle);

            let textureStartPoint;

            while (distanceToTheWall < this.depth) {
                distanceToTheWall += 0.06;

                const testX = position.x + eyeX * distanceToTheWall;
                const testY = position.y + eyeY * distanceToTheWall;
                const nTestX = Math.floor(testX);
                const nTestY = Math.floor(testY);
                if (this.map[nTestX][nTestY] == '#') {
                    const testAngle = Math.abs(
                        Math.atan2(testY - (nTestY + 0.5), testX - (nTestX + 0.5))
                    );
                    if (testAngle > Math.PI * 0.75 || testAngle < Math.PI * 0.25)
                        textureStartPoint = testY - nTestY;
                    else textureStartPoint = testX - nTestX;
                    break;
                } else if (
                    nTestX < 0 ||
                    testX >= this.map.width ||
                    nTestY < 0 ||
                    testY >= this.map.height
                ) {
                    distanceToTheWall = this.depth;
                    break;
                }
            }
            const ceiling = this.height / 2 - this.height / distanceToTheWall;
            const floor = this.height - ceiling;
            this.drawTexture(x * this.pixelSize[0], ceiling, floor - ceiling, textureStartPoint, wall);
            DepthBufer[x] = distanceToTheWall;
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
    }

    drawGun(sprite: Sprite, isRunning: boolean, isMoving: boolean): void { 
        const ratio = (isRunning) ? 60 : 100
        const bias = (isMoving) ? Math.cos(Date.now() / ratio) * (30 * (100 / ratio)) : 0
        const { sx, sy, sWidth, sHeight } = sprite.getFrame();
        let gunSize = this.width / 4;
        this.ctx.drawImage(sprite.sprite, sx, sy, sWidth, sHeight, this.width / 2 - gunSize / 2 + bias, this.height - gunSize, gunSize, gunSize)
    }

    drawUI(position: Position, hpLevel: number): void { 
        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(this.width - 321, 19, 302, 22)
        this.ctx.lineWidth = 1
        this.ctx.fillStyle = "red"
        this.ctx.fillRect(this.width - 320, 20, hpLevel / 100 * 300, 20)

        const mapLessSide = (this.map.height < this.map.width) ? this.map.height : this.map.width
        const mapSize = this.height / 4
        const pixel = mapSize / mapLessSide
        this.ctx.fillStyle = "#FFF"
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                if (this.map[i][j] == '#')
                    this.ctx.fillRect(mapSize - i * pixel + 15, j * pixel, pixel, pixel)
            }
        }
        this.ctx.fillStyle = "red"
        const x = mapSize - position.x * pixel + 35
        const y = position.y * pixel
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        const FOVRightSideX = Math.sin(-position.angle - this.FOV / 2) * 50
        const FOVRightSideY = Math.cos(-position.angle - this.FOV / 2) * 50
        this.ctx.lineTo(x + FOVRightSideX, y + FOVRightSideY)
        this.ctx.moveTo(x, y)
        const FOVLeftSideX = Math.sin(-position.angle + this.FOV / 2) * 50
        const FOVLeftSideY = Math.cos(-position.angle + this.FOV / 2) * 50
        this.ctx.lineTo(x + FOVLeftSideX, y + FOVLeftSideY)
        this.ctx.strokeStyle = "red"
        this.ctx.stroke()
        this.ctx.fillRect(x - 5, y - 5, 10, 10)
    }

    drawRect(x: number, y: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.width, this.height);
    }

    drawTexture(x: number, y: number, height: number, startPos: number, texture: HTMLImageElement) {
        this.ctx.drawImage(wall, wall.width * startPos, 0, this.pixelSize[0], wall.height, x, y, this.pixelSize[0], this.height);
    }

    drawObject(sprite: Sprite, x, y, objWidth, objHeight) {
        this.ctx.drawImage(sprite.sprite, x, y, objWidth, objHeight);
    }
}
