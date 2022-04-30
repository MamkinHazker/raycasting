import { Game } from './game';
import { AK_47 } from './guns';
import { GameMap } from './map';
import { Player } from './player';
import { prepareDocument } from './prepare';
import { Renderer } from './renderer';
import { PixelSize } from './types';

const canvas = (document.getElementById('canvas') as HTMLCanvasElement);

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const width = canvas.width;
const height = canvas.height;

const resolutionX = 800;
const resolutionY = height * (800 / width);

const resolution = { x: resolutionX, y: resolutionY };
const pixelSize: PixelSize = { x: width / resolutionX, y: height / resolutionY };

const ctx = canvas.getContext('2d');

if(!ctx) throw new Error('Something wrong with canvas');

const map: GameMap = new GameMap(
    [
        '#############',
        '#...........#',
        '#...........#',
        '#...........#',
        '#...#####...#',
        '#...#...##..#',
        '#...#...#...#',
        '#...##.##...#',
        '#...........#',
        '#...........#',
        '#########.###',
        '#...........#',
        '#...........#',
        '#...........#',
        '#############',
    ]
);

const player = new Player({ x: 2, y: 2, angle: 0 });
const renderer = new Renderer(map, ctx, resolution, pixelSize, Math.PI * (104/360));
const game = new Game(map, player, renderer);

prepareDocument(canvas, game);

const gun = new AK_47(game.physicalObjects);

player.takeWeapon(gun);

game.start();