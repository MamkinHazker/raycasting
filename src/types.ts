import { AnimatedSprite, Sprite } from './sprite.js';

export type PixelSize = {
    x: number,
    y: number
};

export type Position = {
    x: number,
    y: number,
    angle: number
}

export interface SpriteI {
    sprite: HTMLImageElement;
}

export interface GameMapI {
    value: string[];
    get height(): number;
    get width(): number;
}

export interface GunI {
    sprite: AnimatedSprite;
    physicalObjectManager: PhysycalObjectManagerI;
    fire(position: Position): void;
}

export interface PlayerI {
    hp: number;
    movingForward: boolean;
    movingBack: boolean;
    movingLeft: boolean;
    movingRight: boolean;
    position: Position;
    gun: GunI | undefined;
    isRunning: boolean;
    isMoving: boolean;
    updatePosition(map: GameMapI): void;
    updateAngle(movementX: number): void;
    startAttacking(): void;
    stopAttacking(): void;
}

export interface ColidableI {
    position: Position;
    colides(colidee: ColidableI): boolean;
    handleCollision(colidee: ColidableI): void;
}

export interface DamagingI {
    discriminator: 'Damaging';
    position: Position;
    get isRemoved(): boolean;
    dealDamage(to: DamagableI): void;
}

export interface DamagableI {
    discriminator: 'Damagable';
    position: Position;
    get isRemoved(): boolean;
    takeDamage(damage: number): void;
}

export interface DrawableI {
    position: Position;
    sprite: SpriteI;
    z: number;
}

export type DrawableObjectManagerI = Array<DrawableI>

export type PhysycalObjectManagerI = Array<ColidableI & (DamagableI | DamagingI)>

export interface RendererI {
    map: GameMapI;
    ctx: CanvasRenderingContext2D;
    resolution: { x: number, y: number };
    pixelSize: PixelSize;
    FOV: number;
    depth: number;
    drawFrame(position: Position, objects: DrawableI[]): void;
    drawGun(player: PlayerI): void;
    drawUI(position: Position, hpLevel: number): void;
    drawRect(x: number, y: number, height: number, color: string): void;
    drawTexture(x: number, y: number, height: number, startPos: number, texture: HTMLImageElement): void;
    drawObject(sprite: Sprite, x: number, y: number, objWidth: number, objHeight: number): void;
}

export interface GameI {
    map: GameMapI;
    player: PlayerI;
    renderer: RendererI;
    physicalObjects: PhysycalObjectManagerI;
    drawableObjects: DrawableObjectManagerI;
    handleCollisions(): void;
    start(): void;
    stop(): void;
}

export function isDamagable(object: any): object is DamagableI {
    return object.discriminator === 'Damagable';
}

export function isDamaging(object: any): object is DamagingI {
    return object.discriminator === 'Damaging';
}
