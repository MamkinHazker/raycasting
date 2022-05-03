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
        this.drawRect(0, 0, this.width, this.height / 2, '#A9A9A9');
        this.drawRect(0, this.height / 2, this.width, this.height / 2, '#696969');
        const DepthBufer = [];
        for (let x = 0; x < this.resolution.x; x++) {
            const rayAngle = position.angle - this.FOV / 2 + (x / this.resolution.x) * this.FOV;
            const ray = this.castRay(position, rayAngle);
            const { hitTheWall, distanceToTheWall, textureStartPoint } = ray;
            if (!hitTheWall) continue;
            if (distanceToTheWall > 5) console.log('>5');
            const ceiling = this.height / 2 - this.height / distanceToTheWall;
            const floor = this.height - ceiling;
            //this.drawTexture(x * this.pixelSize.x, ceiling, floor - ceiling, textureStartPoint, wall);
            this.drawRect(x * this.pixelSize.x, ceiling, this.pixelSize.x, floor - ceiling, '#2F4F4F');
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
            const x = this.width * ((angle + this.FOV / 2) / this.FOV);
            if (DepthBufer[Math.round(x / this.pixelSize.x)] < distance) continue;
            const image = objects[i].sprite.sprite;
            const objHeight = 2 * image.height / distance;
            const objWidth = 2 * image.width / distance;
            const z = (2 * this.height * objects[i].z) / distance;
            const floor = this.height / 2 - this.height / distance;
            const y = this.height - (floor + z);
            this.drawObject(objects[i].sprite, x - objWidth / 2, y - objHeight / 2, objWidth, objHeight);
        }
    }

    castRay(position: Position, rayAngle: number): { hitTheWall: boolean, distanceToTheWall: number, textureStartPoint: number } {
        if (rayAngle < -Math.PI) rayAngle += Math.PI * 2;
        else if (rayAngle > Math.PI) rayAngle -= Math.PI * 2;

        const unitStep = {
            x: Math.sqrt(1 + (Math.cos(rayAngle) / Math.sin(rayAngle)) ** 2),
            y: Math.sqrt(1 + (Math.sin(rayAngle) / Math.cos(rayAngle)) ** 2)
        };
        const absoluteCoords = { x: position.x, y: position.y };
        const rayLength = {
            x: (absoluteCoords.x + 1 - position.x) * unitStep.x,
            y: (absoluteCoords.y + 1 - position.y) * unitStep.y,
        };

        const step = { x: 1, y: 1 };
        if (rayAngle < 0) {
            step.x = -1;
            rayLength.x = (position.x - absoluteCoords.x) * unitStep.x;
        }
        if (Math.abs(rayAngle) > Math.PI / 2) {
            step.y = -1;
            rayLength.y = (position.y - absoluteCoords.y) * unitStep.y;
        }


        let textureStartPoint = 0;
        let distanceToTheWall = 0;
        let hitTheWall = false;
        while (!hitTheWall && distanceToTheWall < this.depth) {
            if (rayLength.x < rayLength.y) {
                absoluteCoords.x += step.x;
                distanceToTheWall = rayLength.x;
                rayLength.x += unitStep.x;
            } else {
                absoluteCoords.y += step.y;
                distanceToTheWall = rayLength.y;
                rayLength.y += unitStep.y;
            }
            if (absoluteCoords.x < 0 || absoluteCoords.x >= this.map.width || absoluteCoords.y < 0 || absoluteCoords.y >= this.map.height) {
                return { hitTheWall, distanceToTheWall: this.depth, textureStartPoint };
            }
            else if (this.map.value[Math.round(absoluteCoords.x)][Math.round(absoluteCoords.y)] == '#') {
                hitTheWall = true;
                break;
            }
        }
        return { hitTheWall, distanceToTheWall, textureStartPoint };
    }

    drawGun(player: PlayerI): void {
        const sprite = player.gun?.sprite;
        if (!sprite) return;
        const { isRunning, movingForward, isMoving } = player;
        const ratio = (isRunning && movingForward) ? 60 : 100;
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

    drawRect(x: number, y: number, width: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawTexture(x: number, y: number, height: number, startPos: number, texture: HTMLImageElement) {
        this.ctx.drawImage(wall, wall.width * startPos, 0, this.pixelSize.x, wall.height, x, y, this.pixelSize.y, height);
    }

    drawObject(sprite: SpriteI, x: number, y: number, objWidth: number, objHeight: number) {
        this.ctx.drawImage(sprite.sprite, x, y, objWidth, objHeight);
    }
}
