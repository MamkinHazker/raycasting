import { AnimatedSprite, Sprite } from './sprite.js';


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
    objectManager: ObjectManagerI;
    sprite: AnimatedSprite;
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
    physicalDiscriminator: 'Physical';
    position: Position;
    get isRemoved(): boolean;
    colides(colidee: ColidableI): boolean;
    handleCollision(colidee: ColidableI): void;
}

export interface DamagingI {
    discriminator: 'Damaging';
    position: Position;
    dealDamage(to: DamagableI): void;
}

export interface DamagableI {
    discriminator: 'Damagable';
    position: Position;
    takeDamage(damage: number): void;
}

export interface DrawableI {
    drawableDiscriminator: 'Drawable';
    position: Position;
    sprite: SpriteI;
    z: number;
}

export type DrawableObject = DrawableI;
export type DrawableObjectManagerI = Array<DrawableObject>

export type PhysicalObject = ColidableI;
export type PhysicalObjectManagerI = Array<PhysicalObject>

export interface ObjectManagerI {
    drawableObjects: DrawableObjectManagerI;
    physicalObjects: PhysicalObjectManagerI;
    push(obj: PhysicalObject | DrawableI): void;
}

export interface RendererI {
    map: GameMapI;
    ctx: CanvasRenderingContext2D;
    resolution: { x: number, y: number };
    FOV: number;
    depth: number;
    drawFrame(position: Position, objects: DrawableI[]): void;
    drawGun(player: PlayerI): void;
    drawUI(position: Position, hpLevel: number): void;
    drawTexture(x: number, y: number, height: number, startPos: number, texture: HTMLImageElement): void;
    drawObject(sprite: Sprite, x: number, y: number, objWidth: number, objHeight: number): void;
}

export interface GameI {
    map: GameMapI;
    player: PlayerI;
    renderer: RendererI;
    objectManager: ObjectManagerI;
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

export function isPhysical(object: any): object is PhysicalObject {
    return object.physicalDiscriminator === 'Physical';
}

export function isDrawable(object: any): object is DrawableObject {
    return object.drawableDiscriminator === 'Drawable';
}