import { SpriteI } from './types.js';

export class AnimatedSprite implements SpriteI{
    sprite: HTMLImageElement;
    frameWidth: number;
    frameHeight: number;
    framesCount: number;
    animationsCount: number;
    currentAnimation: number;
    currentFrame: number;

    constructor(sprite: HTMLImageElement, frameWidth: number, frameHeight: number, framesCount: number, animationsCount = 1, currentAnimation = 0, currentFrame = 0) {
        this.sprite = sprite;
        this.frameHeight = frameHeight;
        this.frameWidth = frameWidth;
        this.framesCount = framesCount;
        this.animationsCount = animationsCount;
        this.currentAnimation = currentAnimation;
        this.currentFrame = currentFrame;
    }

    switchFrame() {
        this.currentFrame = (this.currentFrame + 1) % this.framesCount;
    }

    playAnimation(time: number) {
        let timer = setInterval(() => {
            if (this.currentFrame == this.framesCount - 1) clearInterval(timer);
            this.switchFrame();
        }, time / this.framesCount);
    }

    switchAnimation(animationIndex: number) {
        if (animationIndex >= this.animationsCount)
            animationIndex = this.animationsCount - 1;
        this.currentAnimation = animationIndex;
    }

    getFrame() {
        return { sx: this.currentFrame * this.frameWidth, sy: this.currentAnimation * this.frameHeight, sWidth: this.frameWidth, sHeight: this.frameHeight };
    }
}

export class Sprite implements SpriteI {
    sprite: HTMLImageElement;
    constructor(sprite: HTMLImageElement) {
        this.sprite = sprite;
    }
}
