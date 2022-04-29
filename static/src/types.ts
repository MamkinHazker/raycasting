export interface PlayerI {
    hp: number;
    movingForward: boolean;
    movingBack: boolean;
    movingLeft: boolean;
    movingRight: boolean;
    playerX: number;
    playerY: number;
    playerAng: number;
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