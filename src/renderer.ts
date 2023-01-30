import { DrawableObjectManagerI, GameMapI, PlayerI, Position, RendererI, SpriteI } from './types.js';

const wall = new Image();
wall.src = './img/wall.jpg';

export class Renderer implements RendererI {
    map: GameMapI;
    ctx: CanvasRenderingContext2D;
    resolution: { x: number; y: number };
    height: number;
    width: number;
    FOV: number;
    depth = 16;
    hpBar: { width: number; height: number; offset: number };

    constructor(map: GameMapI, ctx: CanvasRenderingContext2D, resolution: { x: number; y: number }, FOV: number) {
        this.map = map;
        this.ctx = ctx;
        this.resolution = resolution;
        this.height = this.ctx.canvas.height;
        this.width = this.ctx.canvas.width;
        this.FOV = FOV;
        this.hpBar = {
            width: this.width / 4,
            height: 10,
            offset: 10,
        };
    }

    drawFrame(position: Position, objects: DrawableObjectManagerI): void {
        this.drawRect(0, 0, this.width, this.height / 2, '#A9A9A9');
        this.drawRect(0, this.height / 2, this.width, this.height / 2, '#696969');
        const DepthBufer = [];
        for (let x = 0; x < this.resolution.x; x++) {
            const rayAngle = position.angle - this.FOV / 2 + (x / this.resolution.x) * this.FOV;
            const ray = this.castRay(position, rayAngle);
            let { hitTheWall, distanceToTheWall, textureStartPoint } = ray;
            if (!hitTheWall) continue;
            const ceiling = this.height / 2 - this.height / distanceToTheWall;
            const floor = this.height - ceiling;
            this.drawTexture(x, ceiling, floor - ceiling, textureStartPoint, wall);
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
            if (DepthBufer[Math.round(x)] < distance) continue;
            const image = objects[i].sprite.sprite;
            const objHeight = (2 * image.height) / distance;
            const objWidth = (2 * image.width) / distance;
            const z = (2 * this.height * objects[i].z) / distance;
            const floor = this.height / 2 - this.height / distance;
            const y = this.height - (floor + z);
            this.drawObject(objects[i].sprite, x - objWidth / 2, y - objHeight / 2, objWidth, objHeight);
        }
    }

    castRay(position: Position, rayAngle: number): { hitTheWall: boolean; distanceToTheWall: number; textureStartPoint: number } {
        const rayDirection = {
            x: Math.sin(rayAngle),
            y: -Math.cos(rayAngle),
        };
        const unitStep = { x: Math.sqrt(1 + (rayDirection.y / rayDirection.x) ** 2), y: Math.sqrt(1 + (rayDirection.x / rayDirection.y) ** 2) };
        const mapCheck = { x: Math.floor(position.x), y: Math.floor(position.y) };
        const rayLength = { x: (mapCheck.x + 1 - position.x) * unitStep.x, y: (mapCheck.y + 1 - position.y) * unitStep.y };
        const step = { x: 1, y: 1 };
        if (rayDirection.x < 0) {
            step.x = -1;
            rayLength.x = (position.x - mapCheck.x) * unitStep.x;
        }
        if (rayDirection.y > 0) {
            step.y = -1;
            rayLength.y = (position.y - mapCheck.y) * unitStep.y;
        }

        let textureStartPoint = 0;
        let distanceToTheWall = 0;
        let hitTheWall = false;
        let side = 0;
        while (!hitTheWall && distanceToTheWall < this.depth) {
            if (rayLength.x < rayLength.y) {
                mapCheck.x += step.x;
                distanceToTheWall = rayLength.x;
                rayLength.x += unitStep.x;
                side = 0;
            } else if (rayLength.y < rayLength.x) {
                mapCheck.y += step.y;
                distanceToTheWall = rayLength.y;
                rayLength.y += unitStep.y;
                side = 1;
            }
            if (mapCheck.x < 0 || mapCheck.x >= this.map.width || mapCheck.y < 0 || mapCheck.y >= this.map.height) {
                return { hitTheWall, distanceToTheWall: this.depth, textureStartPoint };
            } else if (this.map.value[mapCheck.x][mapCheck.y] == '#') {
                hitTheWall = true;
                break;
            }
        }
        const hit = {
            x: position.x + rayDirection.x * distanceToTheWall,
            y: position.y - rayDirection.y * distanceToTheWall,
        };
        if (side == 1) textureStartPoint = hit.x - Math.floor(hit.x);
        else textureStartPoint = hit.y - Math.floor(hit.y);
        if (1 - textureStartPoint < 0.005) textureStartPoint = 0.99;
        if (textureStartPoint < 0.005) textureStartPoint = 0.01;
        distanceToTheWall = Math.cos(rayAngle - position.angle) * distanceToTheWall;
        return { hitTheWall, distanceToTheWall, textureStartPoint: textureStartPoint };
    }

    drawGun(player: PlayerI): void {
        const sprite = player.gun?.sprite;
        if (!sprite) return;
        const { isRunning, movingForward, isMoving } = player;
        const ratio = isRunning && movingForward ? 60 : 100;
        const bias = isMoving ? Math.cos(Date.now() / ratio) * (30 * (100 / ratio)) : 0;
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
        this.ctx.strokeRect(this.width - this.hpBar.offset - this.hpBar.width - 1, this.hpBar.offset - 1, this.hpBar.width + 2, this.hpBar.height + 2);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.width - this.hpBar.offset - this.hpBar.width, this.hpBar.offset, (hpLevel / 100) * this.hpBar.width, this.hpBar.height);
    }

    drawMap(position: Position): void {
        const mapLessSide = this.map.height < this.map.width ? this.map.height : this.map.width;
        const mapSize = this.height / 4;
        const pixel = mapSize / mapLessSide;
        this.ctx.fillStyle = '#FFF';
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                if (this.map.value[i][j] == '#') this.ctx.fillRect(mapSize - i * pixel + 15, j * pixel, pixel, pixel);
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
        (x = Math.round(x)), (y = Math.round(y)), (width = Math.round(width)), (height = Math.round(height));
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawTexture(x: number, y: number, height: number, startPos: number, texture: HTMLImageElement) {
        (x = Math.round(x)), (y = Math.round(y)), (height = Math.round(height));
        this.ctx.drawImage(wall, Math.round(wall.width * startPos), 0, 1, wall.height, x, y, 1, height);
    }

    drawObject(sprite: SpriteI, x: number, y: number, objWidth: number, objHeight: number) {
        this.ctx.drawImage(sprite.sprite, x, y, objWidth, objHeight);
    }
}
