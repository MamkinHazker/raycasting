import { AnimatedSprite } from './sprite.js';
import { PlayerI, SpriteI } from './types.js';
import { Position, RendererI, GameMapI, PixelSize, DrawableObjectManagerI } from './types.js';

const wall = new Image();
wall.src = './img/wall.jpg';

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

    drawFrame(position: Position, objects: DrawableObjectManagerI): void {
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
                if (this.map.value[nTestX][nTestY] == '#') {
                    const testAngle = Math.abs(Math.atan2(testY - (nTestY + 0.5), testX - (nTestX + 0.5)));
                    const ceiling = this.height / 2 - this.height / distanceToTheWall;
                    const floor = this.height - ceiling;
                    if (testAngle > Math.PI * 0.75 || testAngle < Math.PI * 0.25)
                        textureStartPoint = testY - nTestY;
                    else
                        textureStartPoint = testX - nTestX;
                    this.drawTexture(x * this.pixelSize.x, ceiling, floor - ceiling, textureStartPoint, wall);
                    break;
                } else if (nTestX < 0 || testX >= this.map.width || nTestY < 0 || testY >= this.map.height) {
                    distanceToTheWall = this.depth;
                    break;
                }
            }
            DepthBufer[x] = distanceToTheWall;
        }

        for (let i = 0; i < objects.length; i++) {
            const posX = objects[i].position.x;
            const posY = objects[i].position.y;
            let angle = Math.atan2(posX - position.x, posY - position.y) - position.angle;
            if (angle < -Math.PI) angle += Math.PI * 2;
            else if (angle > Math.PI) angle -= Math.PI * 2;
            const distance = Math.sqrt((posY - position.y) ** 2 + (posX - position.x) ** 2);
            if (Math.abs(angle) > this.FOV / 2 || distance > this.depth) continue;
            const image = objects[i].sprite.sprite;
            const objHeight = 2 * image.height / distance;
            const objWidth = objHeight / image.height * image.width;
            const x = this.width * ((angle + this.FOV / 2) / this.FOV);
            if (DepthBufer[Math.round(x / this.pixelSize.x)] < distance) continue;
            const z = (this.height / (this.height - objects[i].z + image.height)) * objects[i].z;
            const y = this.height - (this.height / 2 - this.height / distance) - z / distance;
            this.drawObject(objects[i].sprite, x - objWidth / 2, y - objHeight, objWidth, objHeight);
        }
    }

    drawGun(player: PlayerI): void {
        const sprite = player.gun?.sprite;
        if(!sprite) return;
        const { isRunning, isMoving } = player;
        const ratio = (isRunning) ? 60 : 100;
        const bias = (isMoving) ? Math.cos(Date.now() / ratio) * (30 * (100 / ratio)) : 0;
        const { sx, sy, sWidth, sHeight } = sprite.getFrame();
        let gunSize = this.width / 4;
        this.ctx.drawImage(sprite.sprite, sx, sy, sWidth, sHeight, this.width / 2 - gunSize / 2 + bias, this.height - gunSize, gunSize, gunSize);
    }

    drawUI(position: Position, hpLevel: number): void {
        this.drawHpBar(hpLevel);
        this.drawMap(position);

    }

    drawHpBar(hpLevel: number): void {
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.width - 321, 19, 302, 22);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.width - 320, 20, hpLevel / 100 * 300, 20);
    }

    drawMap(position: Position): void {
        const mapLessSide = (this.map.height < this.map.width) ? this.map.height : this.map.width;
        const mapSize = this.height / 4;
        const pixel = mapSize / mapLessSide;
        this.ctx.fillStyle = '#FFF';
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                if (this.map.value[i][j] == '#')
                    this.ctx.fillRect(mapSize - i * pixel + 15, j * pixel, pixel, pixel);
            }
        }
        this.drawPlayer(mapSize, position, pixel);
    }

    drawPlayer(mapSize: number, position: Position, pixel: number): void {
        this.ctx.fillStyle = 'red';
        const x = mapSize - position.x * pixel + 35;
        const y = position.y * pixel;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        const FOVRightSideX = Math.sin(-position.angle - this.FOV / 2) * 50;
        const FOVRightSideY = Math.cos(-position.angle - this.FOV / 2) * 50;
        this.ctx.lineTo(x + FOVRightSideX, y + FOVRightSideY);
        this.ctx.moveTo(x, y);
        const FOVLeftSideX = Math.sin(-position.angle + this.FOV / 2) * 50;
        const FOVLeftSideY = Math.cos(-position.angle + this.FOV / 2) * 50;
        this.ctx.lineTo(x + FOVLeftSideX, y + FOVLeftSideY);
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
        this.ctx.fillRect(x - 5, y - 5, 10, 10);
    }

    drawRect(x: number, y: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.width, this.height);
    }

    drawTexture(x: number, y: number, height: number, startPos: number, texture: HTMLImageElement) {
        this.ctx.drawImage(wall, wall.width * startPos, 0, this.pixelSize.x, wall.height, x, y, this.pixelSize.y, this.height);
    }

    drawObject(sprite: SpriteI, x: number, y: number, objWidth: number, objHeight: number) {
        this.ctx.drawImage(sprite.sprite, x, y, objWidth, objHeight);
    }
}
