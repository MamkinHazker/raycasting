import { Game } from './game.js';
import { AK_47 } from './guns.js';
import { GameMap } from './map.js';
import { Player } from './player.js';
import { prepareDocument } from './prepare.js';
import { Renderer } from './renderer.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

canvas.width = document.body.clientWidth / 2;
canvas.height = document.body.clientHeight / 2;

const resolutionX = canvas.width;
const resolutionY = canvas.height;

canvas.style.width = `${document.body.clientWidth}px`;
canvas.style.height = `${document.body.clientHeight}px`;

const resolution = { x: resolutionX, y: resolutionY };

const ctx = canvas.getContext('2d');

if (!ctx) throw new Error('Something wrong with canvas');

const map: GameMap = new GameMap([
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
]);

const player = new Player({ x: 2, y: 2, angle: 0 });
const renderer = new Renderer(map, ctx, resolution, Math.PI * (120 / 360));
const game = new Game(map, player, renderer);

prepareDocument(canvas, game);

const gun = new AK_47(game.objectManager);

player.takeWeapon(gun);

game.start();
