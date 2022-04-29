import { Sprite } from "./sprite";

export type Position = {
    x: number,
    y: number,
    angle: number
}

export interface PlayerI {
    hp: number;
    movingForward: boolean;
    movingBack: boolean;
    movingLeft: boolean;
    movingRight: boolean;
    position: Position;
    gun: any;
    isRunning: boolean;
    isMoving: boolean;
    updatePosition(): void;
    updateAngle(movementX: number): void;
    startAttacking(): void;
    stopAttacking(): void;
}

export interface GameI {
    player: PlayerI;
}

export type PixelSize = {
    x: number,
    y: number
};

export interface GameMapI {
    value: string[];
    get height(): number;
    get width(): number;
}

export interface RendererI {
    map: GameMapI;
    ctx: CanvasRenderingContext2D;
    resolution: { x: number, y: number };
    pixelSize: PixelSize;
    FOV: number;
    depth: number;
    drawFrame(position: Position): void;
    drawGun(sprite: Sprite, isRunning: boolean, isMoving: boolean): void
    drawUI(position: Position, hpLevel: number): void;
    drawRect(x: number, y: number, height: number, color: string): void;
    drawTexture(x: number, y: number, height: number, startPos: number, texture: HTMLImageElement);
    drawObject(sprite: Sprite, x, y, objWidth, objHeight);
}