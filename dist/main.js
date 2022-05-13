(()=>{"use strict";class t{constructor(t,i){this.physicalObjects=t,this.drawableObjects=i}push(t){"Drawable"===t.drawableDiscriminator&&this.drawableObjects.push(t),"Physical"===t.physicalDiscriminator&&this.physicalObjects.push(t)}}let i;class s{constructor(t,i,s,e,h=1,a=0,o=0){this.sprite=t,this.frameHeight=s,this.frameWidth=i,this.framesCount=e,this.animationsCount=h,this.currentAnimation=a,this.currentFrame=o}switchFrame(){this.currentFrame=(this.currentFrame+1)%this.framesCount}playAnimation(t){let i=setInterval((()=>{this.currentFrame==this.framesCount-1&&clearInterval(i),this.switchFrame()}),t/this.framesCount)}switchAnimation(t){t>=this.animationsCount&&(t=this.animationsCount-1),this.currentAnimation=t}getFrame(){return{sx:this.currentFrame*this.frameWidth,sy:this.currentAnimation*this.frameHeight,sWidth:this.frameWidth,sHeight:this.frameHeight}}}class e{constructor(t){this.sprite=t}}const h=new Image;h.src="./img/bullet.png";class a{constructor(t,i){this.physicalDiscriminator="Physical",this.drawableDiscriminator="Drawable",this.discriminator="Damaging",this.sprite=new e(h),this.z=.4,this.isColided=!1,this.damage=t,this.position={x:i.x+.5*Math.sin(i.angle),y:i.y+.5*Math.cos(i.angle),angle:i.angle},setInterval((()=>this.updatePosition()),1)}get isRemoved(){return this.isColided}updatePosition(){this.position.x+=.5*Math.sin(this.position.angle),this.position.y+=.5*Math.cos(this.position.angle)}dealDamage(t){t.takeDamage(this.damage),this.isColided=!0}colides(t){return this.position.x==t.position.x&&this.position.y==t.position.y}handleCollision(t){"Damagable"===t.discriminator&&this.dealDamage(t)}}const o=new Image;let n;o.src="./img/glock.png";const r=new Image;r.src="./img/wall.jpg";const c=document.getElementById("canvas");c.width=document.body.clientWidth,c.height=document.body.clientHeight;const l=c.width,g=c.height,p=l/2,d=g*(p/l),m={x:p,y:d},y={x:l/p,y:g/d},u=c.getContext("2d");if(!u)throw new Error("Something wrong with canvas");const x=new class{constructor(t){this.value=t}get height(){return this.value[0].length}get width(){return this.value.length}}(["#############","#...........#","#...........#","#...........#","#...#####...#","#...#...##..#","#...#...#...#","#...##.##...#","#...........#","#...........#","#########.###","#...........#","#...........#","#...........#","#############"]),w=new class{constructor(t,i){this.physicalDiscriminator="Physical",this.discriminator="Damagable",this.hp=100,this.movingForward=!1,this.movingBack=!1,this.movingRight=!1,this.movingLeft=!1,this.isRunning=!1,this.position=t,i&&(this.gun=i)}get isRemoved(){return 0==this.hp}get isMoving(){return this.movingForward||this.movingBack||this.movingLeft||this.movingRight}takeWeapon(t){this.gun=t}updatePosition(t){let i=.06;(this.movingForward||this.movingBack)&&(this.movingLeft||this.movingRight)&&(i*=.707106),this.movingForward&&(this.isRunning&&(i*=1.7),this.position.x+=Math.sin(this.position.angle)*i,this.position.y+=Math.cos(this.position.angle)*i,"#"==t.value[Math.floor(this.position.x)][Math.floor(this.position.y)]&&(this.position.x-=Math.sin(this.position.angle)*i,this.position.y-=Math.cos(this.position.angle)*i)),this.movingBack&&(this.position.x-=Math.sin(this.position.angle)*i,this.position.y-=Math.cos(this.position.angle)*i,"#"==t.value[Math.floor(this.position.x)][Math.floor(this.position.y)]&&(this.position.x+=Math.sin(this.position.angle)*i,this.position.y+=Math.cos(this.position.angle)*i)),this.movingRight&&(this.position.x+=Math.cos(this.position.angle)*i/2,this.position.y-=Math.sin(this.position.angle)*i/2,"#"==t.value[Math.floor(this.position.x)][Math.floor(this.position.y)]&&(this.position.x-=Math.cos(this.position.angle)*i/2,this.position.y+=Math.sin(this.position.angle)*i/2)),this.movingLeft&&(this.position.x-=Math.cos(this.position.angle)*i/2,this.position.y+=Math.sin(this.position.angle)*i/2,"#"==t.value[Math.floor(this.position.x)][Math.floor(this.position.y)]&&(this.position.x+=Math.cos(this.position.angle)*i/2,this.position.y-=Math.sin(this.position.angle)*i/2))}updateAngle(t){this.position.angle=this.position.angle+.001*t,this.position.angle<-Math.PI?this.position.angle+=2*Math.PI:this.position.angle>Math.PI&&(this.position.angle-=2*Math.PI)}startAttacking(){n=setInterval((()=>{var t;null===(t=this.gun)||void 0===t||t.fire(this.position)}),17)}stopAttacking(){clearInterval(n)}takeDamage(t){this.hp-=t,this.hp<0&&(this.hp=0)}colides(t){return this.position.x==t.position.x&&this.position.y==t.position.y}handleCollision(t){"Damaging"===t.discriminator&&t.dealDamage(this)}}({x:2,y:2,angle:0}),M=new class{constructor(t,i,s,e,h){this.depth=16,this.map=t,this.ctx=i,this.resolution=s,this.pixelSize=e,this.height=this.ctx.canvas.height,this.width=this.ctx.canvas.width,this.FOV=h}drawFrame(t,i){this.drawRect(0,0,this.width,this.height/2,"#A9A9A9"),this.drawRect(0,this.height/2,this.width,this.height/2,"#696969");const s=[];for(let i=0;i<this.resolution.x;i++){const e=t.angle-this.FOV/2+i/this.resolution.x*this.FOV,h=this.castRay(t,e);let{hitTheWall:a,distanceToTheWall:o,textureStartPoint:n}=h;if(!a)continue;const c=this.height/2-this.height/o,l=this.height-c;this.drawTexture(i*this.pixelSize.x,c,l-c,n,r),s[i]=o}for(let e=0;e<i.length;e++){const h=i[e].position.x,a=i[e].position.y;let o=Math.atan2(h-t.x,a-t.y)-t.angle;o<-Math.PI?o+=2*Math.PI:o>Math.PI&&(o-=2*Math.PI);const n=Math.sqrt(Math.pow(a-t.y,2)+Math.pow(h-t.x,2));if(Math.abs(o)>this.FOV/2||n>this.depth)continue;const r=this.width*((o+this.FOV/2)/this.FOV);if(s[Math.round(r/this.pixelSize.x)]<n)continue;const c=i[e].sprite.sprite,l=2*c.height/n,g=2*c.width/n,p=2*this.height*i[e].z/n,d=this.height/2-this.height/n,m=this.height-(d+p);this.drawObject(i[e].sprite,r-g/2,m-l/2,g,l)}}castRay(t,i){i<-Math.PI?i+=2*Math.PI:i>Math.PI&&(i-=2*Math.PI);const s=Math.sin(i),e=-Math.cos(i),h=Math.sqrt(1+Math.pow(e/s,2)),a=Math.sqrt(1+Math.pow(s/e,2)),o={x:Math.floor(t.x),y:Math.floor(t.y)},n={x:(o.x+1-t.x)*h,y:(o.y+1-t.y)*a},r={x:1,y:1};s<0&&(r.x=-1,n.x=(t.x-o.x)*h),e>0&&(r.y=-1,n.y=(t.y-o.y)*a);let c=0,l=0,g=!1,p=0;for(;!g&&l<this.depth;){if(n.x<n.y?(o.x+=r.x,l=n.x,n.x+=h,p=0):n.y<n.x&&(o.y+=r.y,l=n.y,n.y+=a,p=1),o.x<0||o.x>=this.map.width||o.y<0||o.y>=this.map.height)return{hitTheWall:g,distanceToTheWall:this.depth,textureStartPoint:c};if("#"==this.map.value[o.x][o.y]){g=!0;break}}const d={x:t.x+s*l,y:t.y-e*l};return c=1==p?d.x-Math.floor(d.x):d.y-Math.floor(d.y),1-c<.005&&(c=.99),c<.005&&(c=.01),l=Math.cos(i-t.angle)*l,{hitTheWall:g,distanceToTheWall:l,textureStartPoint:c}}drawGun(t){var i;const s=null===(i=t.gun)||void 0===i?void 0:i.sprite;if(!s)return;const{isRunning:e,movingForward:h,isMoving:a}=t,o=e&&h?60:100,n=a?Math.cos(Date.now()/o)*(100/o*30):0,{sx:r,sy:c,sWidth:l,sHeight:g}=s.getFrame();let p=this.width/4;this.ctx.drawImage(s.sprite,r,c,l,g,this.width/2-p/2+n,this.height-p,p,p)}drawUI(t,i){this.drawHpBar(i),this.drawMap(t)}drawHpBar(t){this.ctx.strokeStyle="black",this.ctx.lineWidth=2,this.ctx.strokeRect(this.width-321,19,302,22),this.ctx.lineWidth=1,this.ctx.fillStyle="red",this.ctx.fillRect(this.width-320,20,t/100*300,20)}drawMap(t){const i=this.map.height<this.map.width?this.map.height:this.map.width,s=this.height/4,e=s/i;this.ctx.fillStyle="#FFF";for(let t=0;t<this.map.width;t++)for(let i=0;i<this.map.height;i++)"#"==this.map.value[t][i]&&this.ctx.fillRect(s-t*e+15,i*e,e,e);this.drawPlayer(s,t,e)}drawPlayer(t,i,s){this.ctx.fillStyle="red";const e=t-i.x*s+35,h=i.y*s;this.ctx.beginPath(),this.ctx.moveTo(e,h);const a=50*Math.sin(-i.angle-this.FOV/2),o=50*Math.cos(-i.angle-this.FOV/2);this.ctx.lineTo(e+a,h+o),this.ctx.moveTo(e,h);const n=50*Math.sin(-i.angle+this.FOV/2),r=50*Math.cos(-i.angle+this.FOV/2);this.ctx.lineTo(e+n,h+r),this.ctx.strokeStyle="red",this.ctx.stroke(),this.ctx.fillRect(e-5,h-5,10,10)}drawRect(t,i,s,e,h){this.ctx.fillStyle=h,this.ctx.fillRect(t,i,s,e)}drawTexture(t,i,s,e,h){this.ctx.drawImage(r,r.width*e,0,this.pixelSize.x,r.height,t,i,this.pixelSize.y,s)}drawObject(t,i,s,e,h){this.ctx.drawImage(t.sprite,i,s,e,h)}}(x,u,m,y,Math.PI*(120/360)),v=new class{constructor(i,s,e){this.map=i,this.player=s,this.renderer=e,this.objectManager=new t([s],[])}handleCollisions(){if(!(this.objectManager.physicalObjects.length<2))for(let t=0;t<this.objectManager.physicalObjects.length;t++)for(let i=t+1;t<this.objectManager.physicalObjects.length;i++){const s=this.objectManager.physicalObjects[t],e=this.objectManager.physicalObjects[i];if(!s.colides(e))return;s.handleCollision(e),s.isRemoved&&(this.objectManager.physicalObjects.splice(t,1),t--),e.isRemoved&&(this.objectManager.physicalObjects.splice(i,1),i--)}}start(){i=setInterval((()=>{return t=this,i=void 0,e=function*(){new Date,this.renderer.drawFrame(this.player.position,this.objectManager.drawableObjects),this.renderer.drawGun(this.player),this.renderer.drawUI(this.player.position,this.player.hp),this.player.updatePosition(this.map),this.handleCollisions(),this.player.isRemoved&&this.stop()},new((s=void 0)||(s=Promise))((function(h,a){function o(t){try{r(e.next(t))}catch(t){a(t)}}function n(t){try{r(e.throw(t))}catch(t){a(t)}}function r(t){var i;t.done?h(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(o,n)}r((e=e.apply(t,i||[])).next())}));var t,i,s,e}),17)}stop(){clearInterval(i),alert("Game over")}}(x,w,M);!function(t,i){let s=!1;document.addEventListener("keydown",(t=>{switch(t.code){case"KeyW":i.player.movingForward=!0;break;case"KeyS":i.player.movingBack=!0;break;case"KeyD":i.player.movingRight=!0;break;case"KeyA":i.player.movingLeft=!0;break;case"ShiftLeft":i.player.isRunning=!0}})),document.addEventListener("keyup",(t=>{switch(t.code){case"KeyW":i.player.movingForward=!1;break;case"KeyS":i.player.movingBack=!1;break;case"KeyD":i.player.movingRight=!1;break;case"KeyA":i.player.movingLeft=!1;break;case"ShiftLeft":i.player.isRunning=!1}})),document.addEventListener("mousedown",(t=>{0==t.button&&i.player.startAttacking()})),document.addEventListener("mouseup",(t=>{0==t.button&&i.player.stopAttacking()})),document.addEventListener("mousemove",(t=>{t.movementX>300||t.movementX<-300||i.player.updateAngle(t.movementX)})),document.addEventListener("pointerlockchange",(t=>{s=!s})),t.onclick=function(){s||t.requestPointerLock()}}(c,v);const f=new class extends class{constructor(){this.sprite=new s(o,430,500,3),this.damage=0,this.fireRate=100,this.canShoot=!1,this.objectManager=new t([],[])}fire(t){this.canShoot&&(this.objectManager.push(new a(this.damage,t)),this.canShoot=!1,this.sprite.playAnimation(this.fireRate),setTimeout((()=>this.canShoot=!0),this.fireRate))}}{constructor(t){super(),this.damage=100,this.fireRate=200,this.canShoot=!0,this.objectManager=t}}(v.objectManager);w.takeWeapon(f),v.start()})();