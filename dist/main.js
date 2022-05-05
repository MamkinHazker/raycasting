/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./out/game.js":
/*!*********************!*\
  !*** ./out/game.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Game\": () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _objectManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objectManager.js */ \"./out/objectManager.js\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\n\r\nlet gametimer;\r\nclass Game {\r\n    constructor(map, player, renderer) {\r\n        this.map = map;\r\n        this.player = player;\r\n        this.renderer = renderer;\r\n        this.objectManager = new _objectManager_js__WEBPACK_IMPORTED_MODULE_0__.ObjectManager([player], []);\r\n    }\r\n    handleCollisions() {\r\n        if (this.objectManager.physicalObjects.length < 2)\r\n            return;\r\n        for (let i = 0; i < this.objectManager.physicalObjects.length; i++) {\r\n            for (let j = i + 1; i < this.objectManager.physicalObjects.length; j++) {\r\n                const colider = this.objectManager.physicalObjects[i];\r\n                const colidee = this.objectManager.physicalObjects[j];\r\n                if (!colider.colides(colidee))\r\n                    return;\r\n                colider.handleCollision(colidee);\r\n                if (colider.isRemoved) {\r\n                    this.objectManager.physicalObjects.splice(i, 1);\r\n                    i--;\r\n                }\r\n                if (colidee.isRemoved) {\r\n                    this.objectManager.physicalObjects.splice(j, 1);\r\n                    j--;\r\n                }\r\n            }\r\n        }\r\n    }\r\n    start() {\r\n        let slowFrames = 0;\r\n        let fastFrames = 0;\r\n        let frameRate = document.getElementById('fps');\r\n        gametimer = setInterval(() => __awaiter(this, void 0, void 0, function* () {\r\n            const renderingStart = new Date();\r\n            this.renderer.drawFrame(this.player.position, this.objectManager.drawableObjects);\r\n            this.renderer.drawGun(this.player);\r\n            this.renderer.drawUI(this.player.position, this.player.hp);\r\n            let fps = Number((new Date()).getTime() - renderingStart.getTime());\r\n            if (fps > 17)\r\n                slowFrames = (slowFrames + 1) % 1000;\r\n            else\r\n                fastFrames = (fastFrames + 1) % 1000;\r\n            frameRate.innerHTML = String(slowFrames / fastFrames);\r\n            this.player.updatePosition(this.map);\r\n            this.handleCollisions();\r\n            if (this.player.isRemoved) {\r\n                this.stop();\r\n            }\r\n        }), 17);\r\n    }\r\n    stop() {\r\n        clearInterval(gametimer);\r\n        alert('Game over');\r\n    }\r\n}\r\n//# sourceMappingURL=game.js.map\n\n//# sourceURL=webpack://game/./out/game.js?");

/***/ }),

/***/ "./out/guns.js":
/*!*********************!*\
  !*** ./out/guns.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AK_47\": () => (/* binding */ AK_47)\n/* harmony export */ });\n/* harmony import */ var _objectManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objectManager.js */ \"./out/objectManager.js\");\n/* harmony import */ var _projectiles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projectiles.js */ \"./out/projectiles.js\");\n/* harmony import */ var _sprite_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sprite.js */ \"./out/sprite.js\");\n\r\n\r\n\r\nconst pistol = new Image();\r\npistol.src = './img/glock.png';\r\nclass Auto {\r\n    constructor() {\r\n        this.sprite = new _sprite_js__WEBPACK_IMPORTED_MODULE_2__.AnimatedSprite(pistol, 430, 500, 3);\r\n        this.damage = 0;\r\n        this.fireRate = 100;\r\n        this.canShoot = false;\r\n        this.objectManager = new _objectManager_js__WEBPACK_IMPORTED_MODULE_0__.ObjectManager([], []);\r\n    }\r\n    fire(position) {\r\n        if (!this.canShoot)\r\n            return;\r\n        this.objectManager.push(new _projectiles_js__WEBPACK_IMPORTED_MODULE_1__.Bullet(this.damage, position));\r\n        this.canShoot = false;\r\n        this.sprite.playAnimation(this.fireRate);\r\n        setTimeout(() => this.canShoot = true, this.fireRate);\r\n    }\r\n}\r\nclass AK_47 extends Auto {\r\n    constructor(objectManager) {\r\n        super();\r\n        this.damage = 100;\r\n        this.fireRate = 200;\r\n        this.canShoot = true;\r\n        this.objectManager = objectManager;\r\n    }\r\n}\r\n//# sourceMappingURL=guns.js.map\n\n//# sourceURL=webpack://game/./out/guns.js?");

/***/ }),

/***/ "./out/main.js":
/*!*********************!*\
  !*** ./out/main.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ \"./out/game.js\");\n/* harmony import */ var _guns_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./guns.js */ \"./out/guns.js\");\n/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map.js */ \"./out/map.js\");\n/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player.js */ \"./out/player.js\");\n/* harmony import */ var _prepare_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./prepare.js */ \"./out/prepare.js\");\n/* harmony import */ var _renderer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./renderer.js */ \"./out/renderer.js\");\n\r\n\r\n\r\n\r\n\r\n\r\nconst canvas = document.getElementById('canvas');\r\ncanvas.width = document.body.clientWidth;\r\ncanvas.height = document.body.clientHeight;\r\nconst width = canvas.width;\r\nconst height = canvas.height;\r\nconst resolutionX = width / 2;\r\nconst resolutionY = height * (resolutionX / width);\r\nconst resolution = { x: resolutionX, y: resolutionY };\r\nconst pixelSize = { x: width / resolutionX, y: height / resolutionY };\r\nconst ctx = canvas.getContext('2d');\r\nif (!ctx)\r\n    throw new Error('Something wrong with canvas');\r\nconst map = new _map_js__WEBPACK_IMPORTED_MODULE_2__.GameMap([\r\n    '#############',\r\n    '#...........#',\r\n    '#...........#',\r\n    '#...........#',\r\n    '#...#####...#',\r\n    '#...#...##..#',\r\n    '#...#...#...#',\r\n    '#...##.##...#',\r\n    '#...........#',\r\n    '#...........#',\r\n    '#########.###',\r\n    '#...........#',\r\n    '#...........#',\r\n    '#...........#',\r\n    '#############',\r\n]);\r\nconst player = new _player_js__WEBPACK_IMPORTED_MODULE_3__.Player({ x: 2, y: 2, angle: 0 });\r\nconst renderer = new _renderer_js__WEBPACK_IMPORTED_MODULE_5__.Renderer(map, ctx, resolution, pixelSize, Math.PI * (120 / 360));\r\nconst game = new _game_js__WEBPACK_IMPORTED_MODULE_0__.Game(map, player, renderer);\r\n(0,_prepare_js__WEBPACK_IMPORTED_MODULE_4__.prepareDocument)(canvas, game);\r\nconst gun = new _guns_js__WEBPACK_IMPORTED_MODULE_1__.AK_47(game.objectManager);\r\nplayer.takeWeapon(gun);\r\ngame.start();\r\n//# sourceMappingURL=main.js.map\n\n//# sourceURL=webpack://game/./out/main.js?");

/***/ }),

/***/ "./out/map.js":
/*!********************!*\
  !*** ./out/map.js ***!
  \********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameMap\": () => (/* binding */ GameMap)\n/* harmony export */ });\nclass GameMap {\r\n    constructor(value) {\r\n        this.value = value;\r\n    }\r\n    get height() {\r\n        return this.value[0].length;\r\n    }\r\n    get width() {\r\n        return this.value.length;\r\n    }\r\n}\r\n//# sourceMappingURL=map.js.map\n\n//# sourceURL=webpack://game/./out/map.js?");

/***/ }),

/***/ "./out/objectManager.js":
/*!******************************!*\
  !*** ./out/objectManager.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ObjectManager\": () => (/* binding */ ObjectManager)\n/* harmony export */ });\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ \"./out/types.js\");\n\r\nclass ObjectManager {\r\n    constructor(physicalObjects, drawableObjects) {\r\n        this.physicalObjects = physicalObjects;\r\n        this.drawableObjects = drawableObjects;\r\n    }\r\n    push(obj) {\r\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_0__.isDrawable)(obj))\r\n            this.drawableObjects.push(obj);\r\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_0__.isPhysical)(obj))\r\n            this.physicalObjects.push(obj);\r\n    }\r\n}\r\n//# sourceMappingURL=objectManager.js.map\n\n//# sourceURL=webpack://game/./out/objectManager.js?");

/***/ }),

/***/ "./out/player.js":
/*!***********************!*\
  !*** ./out/player.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Player\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ \"./out/types.js\");\n\r\nlet attackingTimer;\r\nclass Player {\r\n    constructor(position, gun) {\r\n        this.physicalDiscriminator = 'Physical';\r\n        this.discriminator = 'Damagable';\r\n        this.hp = 100;\r\n        this.movingForward = false;\r\n        this.movingBack = false;\r\n        this.movingRight = false;\r\n        this.movingLeft = false;\r\n        this.isRunning = false;\r\n        this.position = position;\r\n        if (gun) {\r\n            this.gun = gun;\r\n        }\r\n    }\r\n    get isRemoved() {\r\n        return this.hp == 0;\r\n    }\r\n    get isMoving() {\r\n        return this.movingForward || this.movingBack || this.movingLeft || this.movingRight;\r\n    }\r\n    takeWeapon(gun) {\r\n        this.gun = gun;\r\n    }\r\n    updatePosition(map) {\r\n        let speed = .06;\r\n        if ((this.movingForward || this.movingBack) && (this.movingLeft || this.movingRight))\r\n            speed *= .707106;\r\n        if (this.movingForward) {\r\n            if (this.isRunning)\r\n                speed *= 1.7;\r\n            this.position.x += Math.sin(this.position.angle) * speed;\r\n            this.position.y += Math.cos(this.position.angle) * speed;\r\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\r\n                this.position.x -= Math.sin(this.position.angle) * speed;\r\n                this.position.y -= Math.cos(this.position.angle) * speed;\r\n            }\r\n        }\r\n        if (this.movingBack) {\r\n            this.position.x -= Math.sin(this.position.angle) * speed;\r\n            this.position.y -= Math.cos(this.position.angle) * speed;\r\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\r\n                this.position.x += Math.sin(this.position.angle) * speed;\r\n                this.position.y += Math.cos(this.position.angle) * speed;\r\n            }\r\n        }\r\n        if (this.movingRight) {\r\n            this.position.x += (Math.cos(this.position.angle) * speed) / 2;\r\n            this.position.y -= (Math.sin(this.position.angle) * speed) / 2;\r\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\r\n                this.position.x -= (Math.cos(this.position.angle) * speed) / 2;\r\n                this.position.y += (Math.sin(this.position.angle) * speed) / 2;\r\n            }\r\n        }\r\n        if (this.movingLeft) {\r\n            this.position.x -= (Math.cos(this.position.angle) * speed) / 2;\r\n            this.position.y += (Math.sin(this.position.angle) * speed) / 2;\r\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\r\n                this.position.x += (Math.cos(this.position.angle) * speed) / 2;\r\n                this.position.y -= (Math.sin(this.position.angle) * speed) / 2;\r\n            }\r\n        }\r\n    }\r\n    updateAngle(movementX) {\r\n        this.position.angle = this.position.angle + movementX * .001;\r\n        if (this.position.angle < -Math.PI)\r\n            this.position.angle += Math.PI * 2;\r\n        else if (this.position.angle > Math.PI)\r\n            this.position.angle -= Math.PI * 2;\r\n    }\r\n    startAttacking() {\r\n        attackingTimer = setInterval(() => { var _a; (_a = this.gun) === null || _a === void 0 ? void 0 : _a.fire(this.position); }, 17);\r\n    }\r\n    stopAttacking() {\r\n        clearInterval(attackingTimer);\r\n    }\r\n    takeDamage(damage) {\r\n        this.hp -= damage;\r\n        if (this.hp < 0)\r\n            this.hp = 0;\r\n    }\r\n    colides(colidee) {\r\n        return this.position.x == colidee.position.x && this.position.y == colidee.position.y;\r\n    }\r\n    handleCollision(colidee) {\r\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_0__.isDamaging)(colidee)) {\r\n            colidee.dealDamage(this);\r\n        }\r\n    }\r\n}\r\n//# sourceMappingURL=player.js.map\n\n//# sourceURL=webpack://game/./out/player.js?");

/***/ }),

/***/ "./out/prepare.js":
/*!************************!*\
  !*** ./out/prepare.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"prepareDocument\": () => (/* binding */ prepareDocument)\n/* harmony export */ });\nfunction prepareDocument(canvas, game) {\r\n    let lock = false;\r\n    document.addEventListener('keydown', (e) => {\r\n        let key = e.code;\r\n        switch (key) {\r\n            case 'KeyW':\r\n                game.player.movingForward = true;\r\n                break;\r\n            case 'KeyS':\r\n                game.player.movingBack = true;\r\n                break;\r\n            case 'KeyD':\r\n                game.player.movingRight = true;\r\n                break;\r\n            case 'KeyA':\r\n                game.player.movingLeft = true;\r\n                break;\r\n            case 'ShiftLeft':\r\n                game.player.isRunning = true;\r\n                break;\r\n        }\r\n    });\r\n    document.addEventListener('keyup', (e) => {\r\n        let key = e.code;\r\n        switch (key) {\r\n            case 'KeyW':\r\n                game.player.movingForward = false;\r\n                break;\r\n            case 'KeyS':\r\n                game.player.movingBack = false;\r\n                break;\r\n            case 'KeyD':\r\n                game.player.movingRight = false;\r\n                break;\r\n            case 'KeyA':\r\n                game.player.movingLeft = false;\r\n                break;\r\n            case 'ShiftLeft':\r\n                game.player.isRunning = false;\r\n                break;\r\n        }\r\n    });\r\n    document.addEventListener('mousedown', (e) => {\r\n        if (e.button == 0)\r\n            game.player.startAttacking();\r\n    });\r\n    document.addEventListener('mouseup', (e) => {\r\n        if (e.button == 0)\r\n            game.player.stopAttacking();\r\n    });\r\n    document.addEventListener('mousemove', (e) => {\r\n        if (e.movementX > 300 || e.movementX < -300)\r\n            return;\r\n        game.player.updateAngle(e.movementX);\r\n    });\r\n    document.addEventListener('pointerlockchange', (event) => {\r\n        lock = !lock;\r\n    });\r\n    canvas.onclick = function () {\r\n        if (!lock)\r\n            canvas.requestPointerLock();\r\n    };\r\n}\r\n//# sourceMappingURL=prepare.js.map\n\n//# sourceURL=webpack://game/./out/prepare.js?");

/***/ }),

/***/ "./out/projectiles.js":
/*!****************************!*\
  !*** ./out/projectiles.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bullet\": () => (/* binding */ Bullet)\n/* harmony export */ });\n/* harmony import */ var _sprite_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sprite.js */ \"./out/sprite.js\");\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ \"./out/types.js\");\n\r\n\r\nconst bullet = new Image();\r\nbullet.src = './img/bullet.png';\r\nclass Bullet {\r\n    constructor(damage, position) {\r\n        this.physicalDiscriminator = 'Physical';\r\n        this.drawableDiscriminator = 'Drawable';\r\n        this.discriminator = 'Damaging';\r\n        this.sprite = new _sprite_js__WEBPACK_IMPORTED_MODULE_0__.Sprite(bullet);\r\n        this.z = .4;\r\n        this.isColided = false;\r\n        this.damage = damage;\r\n        this.position = {\r\n            x: position.x + Math.sin(position.angle) * .5,\r\n            y: position.y + Math.cos(position.angle) * .5,\r\n            angle: position.angle\r\n        };\r\n        setInterval(() => this.updatePosition(), 1);\r\n    }\r\n    get isRemoved() {\r\n        return this.isColided;\r\n    }\r\n    updatePosition() {\r\n        this.position.x += Math.sin(this.position.angle) * .5;\r\n        this.position.y += Math.cos(this.position.angle) * .5;\r\n    }\r\n    dealDamage(to) {\r\n        to.takeDamage(this.damage);\r\n        this.isColided = true;\r\n    }\r\n    colides(colidee) {\r\n        return this.position.x == colidee.position.x && this.position.y == colidee.position.y;\r\n    }\r\n    handleCollision(colidee) {\r\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_1__.isDamagable)(colidee)) {\r\n            this.dealDamage(colidee);\r\n        }\r\n    }\r\n}\r\n//# sourceMappingURL=projectiles.js.map\n\n//# sourceURL=webpack://game/./out/projectiles.js?");

/***/ }),

/***/ "./out/renderer.js":
/*!*************************!*\
  !*** ./out/renderer.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Renderer\": () => (/* binding */ Renderer)\n/* harmony export */ });\nconst wall = new Image();\r\nwall.src = './img/wall.jpg';\r\nclass Renderer {\r\n    constructor(map, ctx, resolution, pixelSize, FOV) {\r\n        this.depth = 16;\r\n        this.map = map;\r\n        this.ctx = ctx;\r\n        this.resolution = resolution;\r\n        this.pixelSize = pixelSize;\r\n        this.height = this.ctx.canvas.height;\r\n        this.width = this.ctx.canvas.width;\r\n        this.FOV = FOV;\r\n    }\r\n    drawFrame(position, objects) {\r\n        this.drawRect(0, 0, this.width, this.height / 2, '#A9A9A9');\r\n        this.drawRect(0, this.height / 2, this.width, this.height / 2, '#696969');\r\n        const DepthBufer = [];\r\n        for (let x = 0; x < this.resolution.x; x++) {\r\n            const rayAngle = position.angle - this.FOV / 2 + (x / this.resolution.x) * this.FOV;\r\n            const ray = this.castRay(position, rayAngle);\r\n            let { hitTheWall, distanceToTheWall, textureStartPoint } = ray;\r\n            if (!hitTheWall)\r\n                continue;\r\n            const ceiling = this.height / 2 - this.height / distanceToTheWall;\r\n            const floor = this.height - ceiling;\r\n            this.drawTexture(x * this.pixelSize.x, ceiling, floor - ceiling, textureStartPoint, wall);\r\n            DepthBufer[x] = distanceToTheWall;\r\n        }\r\n        for (let i = 0; i < objects.length; i++) {\r\n            const posX = objects[i].position.x;\r\n            const posY = objects[i].position.y;\r\n            let angle = Math.atan2(posX - position.x, posY - position.y) - position.angle;\r\n            if (angle < -Math.PI)\r\n                angle += Math.PI * 2;\r\n            else if (angle > Math.PI)\r\n                angle -= Math.PI * 2;\r\n            const distance = Math.sqrt(Math.pow((posY - position.y), 2) + Math.pow((posX - position.x), 2));\r\n            if (Math.abs(angle) > this.FOV / 2 || distance > this.depth)\r\n                continue;\r\n            const x = this.width * ((angle + this.FOV / 2) / this.FOV);\r\n            if (DepthBufer[Math.round(x / this.pixelSize.x)] < distance)\r\n                continue;\r\n            const image = objects[i].sprite.sprite;\r\n            const objHeight = 2 * image.height / distance;\r\n            const objWidth = 2 * image.width / distance;\r\n            const z = (2 * this.height * objects[i].z) / distance;\r\n            const floor = this.height / 2 - this.height / distance;\r\n            const y = this.height - (floor + z);\r\n            this.drawObject(objects[i].sprite, x - objWidth / 2, y - objHeight / 2, objWidth, objHeight);\r\n        }\r\n    }\r\n    castRay(position, rayAngle) {\r\n        if (rayAngle < -Math.PI)\r\n            rayAngle += Math.PI * 2; // Normalizing  \r\n        else if (rayAngle > Math.PI)\r\n            rayAngle -= Math.PI * 2; // angle\r\n        const rayDirection = {\r\n            x: Math.sin(rayAngle),\r\n            y: -Math.cos(rayAngle)\r\n        };\r\n        const unitStep = { x: Math.sqrt(1 + Math.pow((rayDirection.y / rayDirection.x), 2)), y: Math.sqrt(1 + Math.pow((rayDirection.x / rayDirection.y), 2)) };\r\n        const mapCheck = { x: Math.floor(position.x), y: Math.floor(position.y) };\r\n        const rayLength = { x: (mapCheck.x + 1 - position.x) * unitStep.x, y: (mapCheck.y + 1 - position.y) * unitStep.y };\r\n        const step = { x: 1, y: 1 };\r\n        if (rayDirection.x < 0) {\r\n            step.x = -1;\r\n            rayLength.x = (position.x - mapCheck.x) * unitStep.x;\r\n        }\r\n        if (rayDirection.y > 0) {\r\n            step.y = -1;\r\n            rayLength.y = (position.y - mapCheck.y) * unitStep.y;\r\n        }\r\n        let textureStartPoint = 0;\r\n        let distanceToTheWall = 0;\r\n        let hitTheWall = false;\r\n        let side = 0;\r\n        while (!hitTheWall && distanceToTheWall < this.depth) {\r\n            if (rayLength.x < rayLength.y) {\r\n                mapCheck.x += step.x;\r\n                distanceToTheWall = rayLength.x;\r\n                rayLength.x += unitStep.x;\r\n                side = 0;\r\n            }\r\n            else if (rayLength.y < rayLength.x) {\r\n                mapCheck.y += step.y;\r\n                distanceToTheWall = rayLength.y;\r\n                rayLength.y += unitStep.y;\r\n                side = 1;\r\n            }\r\n            if (mapCheck.x < 0 || mapCheck.x >= this.map.width || mapCheck.y < 0 || mapCheck.y >= this.map.height) {\r\n                return { hitTheWall, distanceToTheWall: this.depth, textureStartPoint };\r\n            }\r\n            else if (this.map.value[mapCheck.x][mapCheck.y] == '#') {\r\n                hitTheWall = true;\r\n                break;\r\n            }\r\n        }\r\n        const hit = {\r\n            x: (position.x + rayDirection.x * distanceToTheWall),\r\n            y: (position.y - rayDirection.y * distanceToTheWall)\r\n        };\r\n        if (side == 1)\r\n            textureStartPoint = hit.x - Math.floor(hit.x);\r\n        else\r\n            textureStartPoint = hit.y - Math.floor(hit.y);\r\n        if (1 - textureStartPoint < .005)\r\n            textureStartPoint = .99;\r\n        if (textureStartPoint < .005)\r\n            textureStartPoint = .01;\r\n        distanceToTheWall = Math.cos(rayAngle - position.angle) * distanceToTheWall;\r\n        return { hitTheWall, distanceToTheWall, textureStartPoint: textureStartPoint };\r\n    }\r\n    drawGun(player) {\r\n        var _a;\r\n        const sprite = (_a = player.gun) === null || _a === void 0 ? void 0 : _a.sprite;\r\n        if (!sprite)\r\n            return;\r\n        const { isRunning, movingForward, isMoving } = player;\r\n        const ratio = (isRunning && movingForward) ? 60 : 100;\r\n        const bias = (isMoving) ? Math.cos(Date.now() / ratio) * (30 * (100 / ratio)) : 0;\r\n        const { sx, sy, sWidth, sHeight } = sprite.getFrame();\r\n        let gunSize = this.width / 4;\r\n        this.ctx.drawImage(sprite.sprite, sx, sy, sWidth, sHeight, this.width / 2 - gunSize / 2 + bias, this.height - gunSize, gunSize, gunSize);\r\n    }\r\n    drawUI(position, hpLevel) {\r\n        this.drawHpBar(hpLevel);\r\n        this.drawMap(position);\r\n    }\r\n    drawHpBar(hpLevel) {\r\n        this.ctx.strokeStyle = 'black';\r\n        this.ctx.lineWidth = 2;\r\n        this.ctx.strokeRect(this.width - 321, 19, 302, 22);\r\n        this.ctx.lineWidth = 1;\r\n        this.ctx.fillStyle = 'red';\r\n        this.ctx.fillRect(this.width - 320, 20, hpLevel / 100 * 300, 20);\r\n    }\r\n    drawMap(position) {\r\n        const mapLessSide = (this.map.height < this.map.width) ? this.map.height : this.map.width;\r\n        const mapSize = this.height / 4;\r\n        const pixel = mapSize / mapLessSide;\r\n        this.ctx.fillStyle = '#FFF';\r\n        for (let i = 0; i < this.map.width; i++) {\r\n            for (let j = 0; j < this.map.height; j++) {\r\n                if (this.map.value[i][j] == '#')\r\n                    this.ctx.fillRect(mapSize - i * pixel + 15, j * pixel, pixel, pixel);\r\n            }\r\n        }\r\n        this.drawPlayer(mapSize, position, pixel);\r\n    }\r\n    drawPlayer(mapSize, position, pixel) {\r\n        this.ctx.fillStyle = 'red';\r\n        const x = mapSize - position.x * pixel + 35;\r\n        const y = position.y * pixel;\r\n        this.ctx.beginPath();\r\n        this.ctx.moveTo(x, y);\r\n        const FOVRightSideX = Math.sin(-position.angle - this.FOV / 2) * 50;\r\n        const FOVRightSideY = Math.cos(-position.angle - this.FOV / 2) * 50;\r\n        this.ctx.lineTo(x + FOVRightSideX, y + FOVRightSideY);\r\n        this.ctx.moveTo(x, y);\r\n        const FOVLeftSideX = Math.sin(-position.angle + this.FOV / 2) * 50;\r\n        const FOVLeftSideY = Math.cos(-position.angle + this.FOV / 2) * 50;\r\n        this.ctx.lineTo(x + FOVLeftSideX, y + FOVLeftSideY);\r\n        this.ctx.strokeStyle = 'red';\r\n        this.ctx.stroke();\r\n        this.ctx.fillRect(x - 5, y - 5, 10, 10);\r\n    }\r\n    drawRect(x, y, width, height, color) {\r\n        this.ctx.fillStyle = color;\r\n        this.ctx.fillRect(x, y, width, height);\r\n    }\r\n    drawTexture(x, y, height, startPos, texture) {\r\n        this.ctx.drawImage(wall, wall.width * startPos, 0, this.pixelSize.x, wall.height, x, y, this.pixelSize.y, height);\r\n    }\r\n    drawObject(sprite, x, y, objWidth, objHeight) {\r\n        this.ctx.drawImage(sprite.sprite, x, y, objWidth, objHeight);\r\n    }\r\n}\r\n//# sourceMappingURL=renderer.js.map\n\n//# sourceURL=webpack://game/./out/renderer.js?");

/***/ }),

/***/ "./out/sprite.js":
/*!***********************!*\
  !*** ./out/sprite.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AnimatedSprite\": () => (/* binding */ AnimatedSprite),\n/* harmony export */   \"Sprite\": () => (/* binding */ Sprite)\n/* harmony export */ });\nclass AnimatedSprite {\r\n    constructor(sprite, frameWidth, frameHeight, framesCount, animationsCount = 1, currentAnimation = 0, currentFrame = 0) {\r\n        this.sprite = sprite;\r\n        this.frameHeight = frameHeight;\r\n        this.frameWidth = frameWidth;\r\n        this.framesCount = framesCount;\r\n        this.animationsCount = animationsCount;\r\n        this.currentAnimation = currentAnimation;\r\n        this.currentFrame = currentFrame;\r\n    }\r\n    switchFrame() {\r\n        this.currentFrame = (this.currentFrame + 1) % this.framesCount;\r\n    }\r\n    playAnimation(time) {\r\n        let timer = setInterval(() => {\r\n            if (this.currentFrame == this.framesCount - 1)\r\n                clearInterval(timer);\r\n            this.switchFrame();\r\n        }, time / this.framesCount);\r\n    }\r\n    switchAnimation(animationIndex) {\r\n        if (animationIndex >= this.animationsCount)\r\n            animationIndex = this.animationsCount - 1;\r\n        this.currentAnimation = animationIndex;\r\n    }\r\n    getFrame() {\r\n        return { sx: this.currentFrame * this.frameWidth, sy: this.currentAnimation * this.frameHeight, sWidth: this.frameWidth, sHeight: this.frameHeight };\r\n    }\r\n}\r\nclass Sprite {\r\n    constructor(sprite) {\r\n        this.sprite = sprite;\r\n    }\r\n}\r\n//# sourceMappingURL=sprite.js.map\n\n//# sourceURL=webpack://game/./out/sprite.js?");

/***/ }),

/***/ "./out/types.js":
/*!**********************!*\
  !*** ./out/types.js ***!
  \**********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isDamagable\": () => (/* binding */ isDamagable),\n/* harmony export */   \"isDamaging\": () => (/* binding */ isDamaging),\n/* harmony export */   \"isDrawable\": () => (/* binding */ isDrawable),\n/* harmony export */   \"isPhysical\": () => (/* binding */ isPhysical)\n/* harmony export */ });\nfunction isDamagable(object) {\r\n    return object.discriminator === 'Damagable';\r\n}\r\nfunction isDamaging(object) {\r\n    return object.discriminator === 'Damaging';\r\n}\r\nfunction isPhysical(object) {\r\n    return object.physicalDiscriminator === 'Physical';\r\n}\r\nfunction isDrawable(object) {\r\n    return object.drawableDiscriminator === 'Drawable';\r\n}\r\n//# sourceMappingURL=types.js.map\n\n//# sourceURL=webpack://game/./out/types.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./out/main.js");
/******/ 	
/******/ })()
;