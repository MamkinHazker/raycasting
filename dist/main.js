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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Game\": () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _objectManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objectManager.js */ \"./out/objectManager.js\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nlet gametimer;\nclass Game {\n    constructor(map, player, renderer) {\n        this.map = map;\n        this.player = player;\n        this.renderer = renderer;\n        this.objectManager = new _objectManager_js__WEBPACK_IMPORTED_MODULE_0__.ObjectManager([player], []);\n    }\n    handleCollisions() {\n        if (this.objectManager.physicalObjects.length < 2)\n            return;\n        for (let i = 0; i < this.objectManager.physicalObjects.length; i++) {\n            for (let j = i + 1; i < this.objectManager.physicalObjects.length; j++) {\n                const colider = this.objectManager.physicalObjects[i];\n                const colidee = this.objectManager.physicalObjects[j];\n                if (!colider.colides(colidee))\n                    return;\n                colider.handleCollision(colidee);\n                if (colider.isRemoved) {\n                    this.objectManager.physicalObjects.splice(i, 1);\n                    i--;\n                }\n                if (colidee.isRemoved) {\n                    this.objectManager.physicalObjects.splice(j, 1);\n                    j--;\n                }\n            }\n        }\n    }\n    start() {\n        let frameRate = document.getElementById('fps');\n        gametimer = setInterval(() => __awaiter(this, void 0, void 0, function* () {\n            const renderingStart = new Date();\n            this.renderer.drawFrame(this.player.position, this.objectManager.drawableObjects);\n            this.renderer.drawGun(this.player);\n            this.renderer.drawUI(this.player.position, this.player.hp);\n            let fps = 1000 / Number((new Date()).getTime() - renderingStart.getTime());\n            frameRate.innerHTML = String(fps);\n            this.player.updatePosition(this.map);\n            this.handleCollisions();\n            if (this.player.isRemoved) {\n                this.stop();\n            }\n        }), 17);\n    }\n    stop() {\n        clearInterval(gametimer);\n        alert('Game over');\n    }\n}\n//# sourceMappingURL=game.js.map\n\n//# sourceURL=webpack://game/./out/game.js?");

/***/ }),

/***/ "./out/guns.js":
/*!*********************!*\
  !*** ./out/guns.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AK_47\": () => (/* binding */ AK_47)\n/* harmony export */ });\n/* harmony import */ var _objectManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objectManager.js */ \"./out/objectManager.js\");\n/* harmony import */ var _projectiles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projectiles.js */ \"./out/projectiles.js\");\n/* harmony import */ var _sprite_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sprite.js */ \"./out/sprite.js\");\n\n\n\nconst pistol = new Image();\npistol.src = './img/glock.png';\nclass Auto {\n    constructor() {\n        this.sprite = new _sprite_js__WEBPACK_IMPORTED_MODULE_2__.AnimatedSprite(pistol, 430, 500, 3);\n        this.damage = 0;\n        this.fireRate = 100;\n        this.canShoot = false;\n        this.objectManager = new _objectManager_js__WEBPACK_IMPORTED_MODULE_0__.ObjectManager([], []);\n    }\n    fire(position) {\n        if (!this.canShoot)\n            return;\n        this.objectManager.push(new _projectiles_js__WEBPACK_IMPORTED_MODULE_1__.Bullet(this.damage, position));\n        this.canShoot = false;\n        this.sprite.playAnimation(this.fireRate);\n        setTimeout(() => this.canShoot = true, this.fireRate);\n    }\n}\nclass AK_47 extends Auto {\n    constructor(objectManager) {\n        super();\n        this.damage = 100;\n        this.fireRate = 200;\n        this.canShoot = true;\n        this.objectManager = objectManager;\n    }\n}\n//# sourceMappingURL=guns.js.map\n\n//# sourceURL=webpack://game/./out/guns.js?");

/***/ }),

/***/ "./out/main.js":
/*!*********************!*\
  !*** ./out/main.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ \"./out/game.js\");\n/* harmony import */ var _guns_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./guns.js */ \"./out/guns.js\");\n/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map.js */ \"./out/map.js\");\n/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player.js */ \"./out/player.js\");\n/* harmony import */ var _prepare_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./prepare.js */ \"./out/prepare.js\");\n/* harmony import */ var _renderer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./renderer.js */ \"./out/renderer.js\");\n\n\n\n\n\n\nconst canvas = document.getElementById('canvas');\ncanvas.width = document.body.clientWidth;\ncanvas.height = document.body.clientHeight;\nconst width = canvas.width;\nconst height = canvas.height;\nconst resolutionX = width / 2;\nconst resolutionY = height * (resolutionX / width);\nconst resolution = { x: resolutionX, y: resolutionY };\nconst pixelSize = { x: width / resolutionX, y: height / resolutionY };\nconst ctx = canvas.getContext('2d');\nif (!ctx)\n    throw new Error('Something wrong with canvas');\nconst map = new _map_js__WEBPACK_IMPORTED_MODULE_2__.GameMap([\n    '#############',\n    '#...........#',\n    '#...........#',\n    '#...........#',\n    '#...#####...#',\n    '#...#...##..#',\n    '#...#...#...#',\n    '#...##.##...#',\n    '#...........#',\n    '#...........#',\n    '#########.###',\n    '#...........#',\n    '#...........#',\n    '#...........#',\n    '#############',\n]);\nconst player = new _player_js__WEBPACK_IMPORTED_MODULE_3__.Player({ x: 2, y: 2, angle: 0 });\nconst renderer = new _renderer_js__WEBPACK_IMPORTED_MODULE_5__.Renderer(map, ctx, resolution, pixelSize, Math.PI * (120 / 360));\nconst game = new _game_js__WEBPACK_IMPORTED_MODULE_0__.Game(map, player, renderer);\n(0,_prepare_js__WEBPACK_IMPORTED_MODULE_4__.prepareDocument)(canvas, game);\nconst gun = new _guns_js__WEBPACK_IMPORTED_MODULE_1__.AK_47(game.objectManager);\nplayer.takeWeapon(gun);\ngame.start();\n//# sourceMappingURL=main.js.map\n\n//# sourceURL=webpack://game/./out/main.js?");

/***/ }),

/***/ "./out/map.js":
/*!********************!*\
  !*** ./out/map.js ***!
  \********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameMap\": () => (/* binding */ GameMap)\n/* harmony export */ });\nclass GameMap {\n    constructor(value) {\n        this.value = value;\n    }\n    get height() {\n        return this.value[0].length;\n    }\n    get width() {\n        return this.value.length;\n    }\n}\n//# sourceMappingURL=map.js.map\n\n//# sourceURL=webpack://game/./out/map.js?");

/***/ }),

/***/ "./out/objectManager.js":
/*!******************************!*\
  !*** ./out/objectManager.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ObjectManager\": () => (/* binding */ ObjectManager)\n/* harmony export */ });\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ \"./out/types.js\");\n\nclass ObjectManager {\n    constructor(physicalObjects, drawableObjects) {\n        this.physicalObjects = physicalObjects;\n        this.drawableObjects = drawableObjects;\n    }\n    push(obj) {\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_0__.isDrawable)(obj))\n            this.drawableObjects.push(obj);\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_0__.isPhysical)(obj))\n            this.physicalObjects.push(obj);\n    }\n}\n//# sourceMappingURL=objectManager.js.map\n\n//# sourceURL=webpack://game/./out/objectManager.js?");

/***/ }),

/***/ "./out/player.js":
/*!***********************!*\
  !*** ./out/player.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Player\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ \"./out/types.js\");\n\nlet attackingTimer;\nclass Player {\n    constructor(position, gun) {\n        this.physicalDiscriminator = 'Physical';\n        this.discriminator = 'Damagable';\n        this.hp = 100;\n        this.movingForward = false;\n        this.movingBack = false;\n        this.movingRight = false;\n        this.movingLeft = false;\n        this.isRunning = false;\n        this.position = position;\n        if (gun) {\n            this.gun = gun;\n        }\n    }\n    get isRemoved() {\n        return this.hp == 0;\n    }\n    get isMoving() {\n        return this.movingForward || this.movingBack || this.movingLeft || this.movingRight;\n    }\n    takeWeapon(gun) {\n        this.gun = gun;\n    }\n    updatePosition(map) {\n        let speed = .06;\n        if ((this.movingForward || this.movingBack) && (this.movingLeft || this.movingRight))\n            speed *= .707106;\n        if (this.movingForward) {\n            if (this.isRunning)\n                speed *= 1.7;\n            this.position.x += Math.sin(this.position.angle) * speed;\n            this.position.y += Math.cos(this.position.angle) * speed;\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\n                this.position.x -= Math.sin(this.position.angle) * speed;\n                this.position.y -= Math.cos(this.position.angle) * speed;\n            }\n        }\n        if (this.movingBack) {\n            this.position.x -= Math.sin(this.position.angle) * speed;\n            this.position.y -= Math.cos(this.position.angle) * speed;\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\n                this.position.x += Math.sin(this.position.angle) * speed;\n                this.position.y += Math.cos(this.position.angle) * speed;\n            }\n        }\n        if (this.movingRight) {\n            this.position.x += (Math.cos(this.position.angle) * speed) / 2;\n            this.position.y -= (Math.sin(this.position.angle) * speed) / 2;\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\n                this.position.x -= (Math.cos(this.position.angle) * speed) / 2;\n                this.position.y += (Math.sin(this.position.angle) * speed) / 2;\n            }\n        }\n        if (this.movingLeft) {\n            this.position.x -= (Math.cos(this.position.angle) * speed) / 2;\n            this.position.y += (Math.sin(this.position.angle) * speed) / 2;\n            if (map.value[Math.floor(this.position.x)][Math.floor(this.position.y)] == '#') {\n                this.position.x += (Math.cos(this.position.angle) * speed) / 2;\n                this.position.y -= (Math.sin(this.position.angle) * speed) / 2;\n            }\n        }\n    }\n    updateAngle(movementX) {\n        this.position.angle = this.position.angle + movementX * .001;\n        if (this.position.angle < -Math.PI)\n            this.position.angle += Math.PI * 2;\n        else if (this.position.angle > Math.PI)\n            this.position.angle -= Math.PI * 2;\n    }\n    startAttacking() {\n        attackingTimer = setInterval(() => { var _a; (_a = this.gun) === null || _a === void 0 ? void 0 : _a.fire(this.position); }, 17);\n    }\n    stopAttacking() {\n        clearInterval(attackingTimer);\n    }\n    takeDamage(damage) {\n        this.hp -= damage;\n        if (this.hp < 0)\n            this.hp = 0;\n    }\n    colides(colidee) {\n        return this.position.x == colidee.position.x && this.position.y == colidee.position.y;\n    }\n    handleCollision(colidee) {\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_0__.isDamaging)(colidee)) {\n            colidee.dealDamage(this);\n        }\n    }\n}\n//# sourceMappingURL=player.js.map\n\n//# sourceURL=webpack://game/./out/player.js?");

/***/ }),

/***/ "./out/prepare.js":
/*!************************!*\
  !*** ./out/prepare.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"prepareDocument\": () => (/* binding */ prepareDocument)\n/* harmony export */ });\nfunction prepareDocument(canvas, game) {\n    let lock = false;\n    document.addEventListener('keydown', (e) => {\n        let key = e.code;\n        switch (key) {\n            case 'KeyW':\n                game.player.movingForward = true;\n                break;\n            case 'KeyS':\n                game.player.movingBack = true;\n                break;\n            case 'KeyD':\n                game.player.movingRight = true;\n                break;\n            case 'KeyA':\n                game.player.movingLeft = true;\n                break;\n            case 'ShiftLeft':\n                game.player.isRunning = true;\n                break;\n        }\n    });\n    document.addEventListener('keyup', (e) => {\n        let key = e.code;\n        switch (key) {\n            case 'KeyW':\n                game.player.movingForward = false;\n                break;\n            case 'KeyS':\n                game.player.movingBack = false;\n                break;\n            case 'KeyD':\n                game.player.movingRight = false;\n                break;\n            case 'KeyA':\n                game.player.movingLeft = false;\n                break;\n            case 'ShiftLeft':\n                game.player.isRunning = false;\n                break;\n        }\n    });\n    document.addEventListener('mousedown', (e) => {\n        if (e.button == 0)\n            game.player.startAttacking();\n    });\n    document.addEventListener('mouseup', (e) => {\n        if (e.button == 0)\n            game.player.stopAttacking();\n    });\n    document.addEventListener('mousemove', (e) => {\n        if (e.movementX > 300 || e.movementX < -300)\n            return;\n        game.player.updateAngle(e.movementX);\n    });\n    document.addEventListener('pointerlockchange', (event) => {\n        lock = !lock;\n    });\n    canvas.onclick = function () {\n        if (!lock)\n            canvas.requestPointerLock();\n    };\n}\n//# sourceMappingURL=prepare.js.map\n\n//# sourceURL=webpack://game/./out/prepare.js?");

/***/ }),

/***/ "./out/projectiles.js":
/*!****************************!*\
  !*** ./out/projectiles.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bullet\": () => (/* binding */ Bullet)\n/* harmony export */ });\n/* harmony import */ var _sprite_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sprite.js */ \"./out/sprite.js\");\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ \"./out/types.js\");\n\n\nconst bullet = new Image();\nbullet.src = './img/bullet.png';\nclass Bullet {\n    constructor(damage, position) {\n        this.physicalDiscriminator = 'Physical';\n        this.drawableDiscriminator = 'Drawable';\n        this.discriminator = 'Damaging';\n        this.sprite = new _sprite_js__WEBPACK_IMPORTED_MODULE_0__.Sprite(bullet);\n        this.z = .4;\n        this.isColided = false;\n        this.damage = damage;\n        this.position = {\n            x: position.x + Math.sin(position.angle) * .5,\n            y: position.y + Math.cos(position.angle) * .5,\n            angle: position.angle\n        };\n        setInterval(() => this.updatePosition(), 1);\n    }\n    get isRemoved() {\n        return this.isColided;\n    }\n    updatePosition() {\n        this.position.x += Math.sin(this.position.angle) * .5;\n        this.position.y += Math.cos(this.position.angle) * .5;\n    }\n    dealDamage(to) {\n        to.takeDamage(this.damage);\n        this.isColided = true;\n    }\n    colides(colidee) {\n        return this.position.x == colidee.position.x && this.position.y == colidee.position.y;\n    }\n    handleCollision(colidee) {\n        if ((0,_types_js__WEBPACK_IMPORTED_MODULE_1__.isDamagable)(colidee)) {\n            this.dealDamage(colidee);\n        }\n    }\n}\n//# sourceMappingURL=projectiles.js.map\n\n//# sourceURL=webpack://game/./out/projectiles.js?");

/***/ }),

/***/ "./out/renderer.js":
/*!*************************!*\
  !*** ./out/renderer.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Renderer\": () => (/* binding */ Renderer)\n/* harmony export */ });\nconst wall = new Image();\nwall.src = './img/wall.jpg';\nclass Renderer {\n    constructor(map, ctx, resolution, pixelSize, FOV) {\n        this.depth = 16;\n        this.map = map;\n        this.ctx = ctx;\n        this.resolution = resolution;\n        this.pixelSize = pixelSize;\n        this.height = this.ctx.canvas.height;\n        this.width = this.ctx.canvas.width;\n        this.FOV = FOV;\n    }\n    drawFrame(position, objects) {\n        this.drawRect(0, 0, this.width, this.height / 2, '#A9A9A9');\n        this.drawRect(0, this.height / 2, this.width, this.height / 2, '#696969');\n        const DepthBufer = [];\n        for (let x = 0; x < this.resolution.x; x++) {\n            const rayAngle = position.angle - this.FOV / 2 + (x / this.resolution.x) * this.FOV;\n            const ray = this.castRay(position, rayAngle);\n            let { hitTheWall, distanceToTheWall, textureStartPoint } = ray;\n            if (!hitTheWall)\n                continue;\n            const ceiling = this.height / 2 - this.height / distanceToTheWall;\n            const floor = this.height - ceiling;\n            this.drawTexture(x * this.pixelSize.x, ceiling, floor - ceiling, textureStartPoint, wall);\n            DepthBufer[x] = distanceToTheWall;\n        }\n        for (let i = 0; i < objects.length; i++) {\n            const posX = objects[i].position.x;\n            const posY = objects[i].position.y;\n            let angle = Math.atan2(posX - position.x, posY - position.y) - position.angle;\n            if (angle < -Math.PI)\n                angle += Math.PI * 2;\n            else if (angle > Math.PI)\n                angle -= Math.PI * 2;\n            const distance = Math.sqrt(Math.pow((posY - position.y), 2) + Math.pow((posX - position.x), 2));\n            if (Math.abs(angle) > this.FOV / 2 || distance > this.depth)\n                continue;\n            const x = this.width * ((angle + this.FOV / 2) / this.FOV);\n            if (DepthBufer[Math.round(x / this.pixelSize.x)] < distance)\n                continue;\n            const image = objects[i].sprite.sprite;\n            const objHeight = 2 * image.height / distance;\n            const objWidth = 2 * image.width / distance;\n            const z = (2 * this.height * objects[i].z) / distance;\n            const floor = this.height / 2 - this.height / distance;\n            const y = this.height - (floor + z);\n            this.drawObject(objects[i].sprite, x - objWidth / 2, y - objHeight / 2, objWidth, objHeight);\n        }\n    }\n    castRay(position, rayAngle) {\n        if (rayAngle < -Math.PI)\n            rayAngle += Math.PI * 2; // Normalizing  \n        else if (rayAngle > Math.PI)\n            rayAngle -= Math.PI * 2; // angle\n        const rayDirection = {\n            x: Math.sin(rayAngle),\n            y: -Math.cos(rayAngle)\n        };\n        const unitStep = { x: Math.sqrt(1 + Math.pow((rayDirection.y / rayDirection.x), 2)), y: Math.sqrt(1 + Math.pow((rayDirection.x / rayDirection.y), 2)) };\n        const mapCheck = { x: Math.floor(position.x), y: Math.floor(position.y) };\n        const rayLength = { x: (mapCheck.x + 1 - position.x) * unitStep.x, y: (mapCheck.y + 1 - position.y) * unitStep.y };\n        const step = { x: 1, y: 1 };\n        if (rayDirection.x < 0) {\n            step.x = -1;\n            rayLength.x = (position.x - mapCheck.x) * unitStep.x;\n        }\n        if (rayDirection.y > 0) {\n            step.y = -1;\n            rayLength.y = (position.y - mapCheck.y) * unitStep.y;\n        }\n        let textureStartPoint = 0;\n        let distanceToTheWall = 0;\n        let hitTheWall = false;\n        let side = 0;\n        while (!hitTheWall && distanceToTheWall < this.depth) {\n            if (rayLength.x < rayLength.y) {\n                mapCheck.x += step.x;\n                distanceToTheWall = rayLength.x;\n                rayLength.x += unitStep.x;\n                side = 0;\n            }\n            else if (rayLength.y < rayLength.x) {\n                mapCheck.y += step.y;\n                distanceToTheWall = rayLength.y;\n                rayLength.y += unitStep.y;\n                side = 1;\n            }\n            if (mapCheck.x < 0 || mapCheck.x >= this.map.width || mapCheck.y < 0 || mapCheck.y >= this.map.height) {\n                return { hitTheWall, distanceToTheWall: this.depth, textureStartPoint };\n            }\n            else if (this.map.value[mapCheck.x][mapCheck.y] == '#') {\n                hitTheWall = true;\n                break;\n            }\n        }\n        const hit = {\n            x: (position.x + rayDirection.x * distanceToTheWall),\n            y: (position.y - rayDirection.y * distanceToTheWall)\n        };\n        if (side == 1)\n            textureStartPoint = hit.x - Math.floor(hit.x);\n        else\n            textureStartPoint = hit.y - Math.floor(hit.y);\n        if (1 - textureStartPoint < .005)\n            textureStartPoint = .99;\n        if (textureStartPoint < .005)\n            textureStartPoint = .01;\n        distanceToTheWall = Math.cos(rayAngle - position.angle) * distanceToTheWall;\n        return { hitTheWall, distanceToTheWall, textureStartPoint: textureStartPoint };\n    }\n    drawGun(player) {\n        var _a;\n        const sprite = (_a = player.gun) === null || _a === void 0 ? void 0 : _a.sprite;\n        if (!sprite)\n            return;\n        const { isRunning, movingForward, isMoving } = player;\n        const ratio = (isRunning && movingForward) ? 60 : 100;\n        const bias = (isMoving) ? Math.cos(Date.now() / ratio) * (30 * (100 / ratio)) : 0;\n        const { sx, sy, sWidth, sHeight } = sprite.getFrame();\n        let gunSize = this.width / 4;\n        this.ctx.drawImage(sprite.sprite, sx, sy, sWidth, sHeight, this.width / 2 - gunSize / 2 + bias, this.height - gunSize, gunSize, gunSize);\n    }\n    drawUI(position, hpLevel) {\n        this.drawHpBar(hpLevel);\n        this.drawMap(position);\n    }\n    drawHpBar(hpLevel) {\n        this.ctx.strokeStyle = 'black';\n        this.ctx.lineWidth = 2;\n        this.ctx.strokeRect(this.width - 321, 19, 302, 22);\n        this.ctx.lineWidth = 1;\n        this.ctx.fillStyle = 'red';\n        this.ctx.fillRect(this.width - 320, 20, hpLevel / 100 * 300, 20);\n    }\n    drawMap(position) {\n        const mapLessSide = (this.map.height < this.map.width) ? this.map.height : this.map.width;\n        const mapSize = this.height / 4;\n        const pixel = mapSize / mapLessSide;\n        this.ctx.fillStyle = '#FFF';\n        for (let i = 0; i < this.map.width; i++) {\n            for (let j = 0; j < this.map.height; j++) {\n                if (this.map.value[i][j] == '#')\n                    this.ctx.fillRect(mapSize - i * pixel + 15, j * pixel, pixel, pixel);\n            }\n        }\n        this.drawPlayer(mapSize, position, pixel);\n    }\n    drawPlayer(mapSize, position, pixel) {\n        this.ctx.fillStyle = 'red';\n        const x = mapSize - position.x * pixel + 35;\n        const y = position.y * pixel;\n        this.ctx.beginPath();\n        this.ctx.moveTo(x, y);\n        const FOVRightSideX = Math.sin(-position.angle - this.FOV / 2) * 50;\n        const FOVRightSideY = Math.cos(-position.angle - this.FOV / 2) * 50;\n        this.ctx.lineTo(x + FOVRightSideX, y + FOVRightSideY);\n        this.ctx.moveTo(x, y);\n        const FOVLeftSideX = Math.sin(-position.angle + this.FOV / 2) * 50;\n        const FOVLeftSideY = Math.cos(-position.angle + this.FOV / 2) * 50;\n        this.ctx.lineTo(x + FOVLeftSideX, y + FOVLeftSideY);\n        this.ctx.strokeStyle = 'red';\n        this.ctx.stroke();\n        this.ctx.fillRect(x - 5, y - 5, 10, 10);\n    }\n    drawRect(x, y, width, height, color) {\n        this.ctx.fillStyle = color;\n        this.ctx.fillRect(x, y, width, height);\n    }\n    drawTexture(x, y, height, startPos, texture) {\n        this.ctx.drawImage(wall, wall.width * startPos, 0, this.pixelSize.x, wall.height, x, y, this.pixelSize.y, height);\n    }\n    drawObject(sprite, x, y, objWidth, objHeight) {\n        this.ctx.drawImage(sprite.sprite, x, y, objWidth, objHeight);\n    }\n}\n//# sourceMappingURL=renderer.js.map\n\n//# sourceURL=webpack://game/./out/renderer.js?");

/***/ }),

/***/ "./out/sprite.js":
/*!***********************!*\
  !*** ./out/sprite.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AnimatedSprite\": () => (/* binding */ AnimatedSprite),\n/* harmony export */   \"Sprite\": () => (/* binding */ Sprite)\n/* harmony export */ });\nclass AnimatedSprite {\n    constructor(sprite, frameWidth, frameHeight, framesCount, animationsCount = 1, currentAnimation = 0, currentFrame = 0) {\n        this.sprite = sprite;\n        this.frameHeight = frameHeight;\n        this.frameWidth = frameWidth;\n        this.framesCount = framesCount;\n        this.animationsCount = animationsCount;\n        this.currentAnimation = currentAnimation;\n        this.currentFrame = currentFrame;\n    }\n    switchFrame() {\n        this.currentFrame = (this.currentFrame + 1) % this.framesCount;\n    }\n    playAnimation(time) {\n        let timer = setInterval(() => {\n            if (this.currentFrame == this.framesCount - 1)\n                clearInterval(timer);\n            this.switchFrame();\n        }, time / this.framesCount);\n    }\n    switchAnimation(animationIndex) {\n        if (animationIndex >= this.animationsCount)\n            animationIndex = this.animationsCount - 1;\n        this.currentAnimation = animationIndex;\n    }\n    getFrame() {\n        return { sx: this.currentFrame * this.frameWidth, sy: this.currentAnimation * this.frameHeight, sWidth: this.frameWidth, sHeight: this.frameHeight };\n    }\n}\nclass Sprite {\n    constructor(sprite) {\n        this.sprite = sprite;\n    }\n}\n//# sourceMappingURL=sprite.js.map\n\n//# sourceURL=webpack://game/./out/sprite.js?");

/***/ }),

/***/ "./out/types.js":
/*!**********************!*\
  !*** ./out/types.js ***!
  \**********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isDamagable\": () => (/* binding */ isDamagable),\n/* harmony export */   \"isDamaging\": () => (/* binding */ isDamaging),\n/* harmony export */   \"isDrawable\": () => (/* binding */ isDrawable),\n/* harmony export */   \"isPhysical\": () => (/* binding */ isPhysical)\n/* harmony export */ });\nfunction isDamagable(object) {\n    return object.discriminator === 'Damagable';\n}\nfunction isDamaging(object) {\n    return object.discriminator === 'Damaging';\n}\nfunction isPhysical(object) {\n    return object.physicalDiscriminator === 'Physical';\n}\nfunction isDrawable(object) {\n    return object.drawableDiscriminator === 'Drawable';\n}\n//# sourceMappingURL=types.js.map\n\n//# sourceURL=webpack://game/./out/types.js?");

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