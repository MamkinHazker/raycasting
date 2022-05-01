import { GameMapI } from './types.js';

export class GameMap implements GameMapI {
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