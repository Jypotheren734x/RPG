/**
 * Created by komar on 6/5/2017.
 */
function Drawable(img, speed) {
	this.x = 10;
	this.y = 10;
	this.speed = speed;
	this.sprite = new SpriteSheet(img);
}
function SpriteSheet(img, frameWidth, frameHeight, frameSpeed, start, end) {
	this.x = 10;
	this.y = 10;
	this.image = new Image();
	this.image.src = img;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	var self = this;
	self.image.onload = function() {
		self.frames = Math.floor(self.image.width / self.frameWidth);
	};
	this.sequence = [];
	this.current = 0;
	this.counter = 0;

	for(f = start; f<=end; f++){
		this.sequence.push(f);
	}
	this.update = function () {
		if(this.counter == (frameSpeed - 1)){
			this.current = (this.current + 1) % this.sequence.length;
		}
		this.counter = (this.counter + 1) % frameSpeed;
	};
	this.draw = function (ctx) {
		var row = Math.floor(this.sequence[this.current] / this.frames);
		var col = Math.floor(this.sequence[this.current] % this.frames);
		ctx.drawImage(
			this.image,
			col * this.frameWidth, row * this.frameHeight,
			this.frameWidth, this.frameHeight,
			this.x, this.y,
			this.frameWidth, this.frameHeight);
	}
}
function Player(img, attack, speed) {
	Drawable.call(this,img, speed);
	this.sprite = new SpriteSheet(img, 32, 48,10,0,3);
	this.attack = attack;
	this.active = false;
	this.move = function () {
		if(Key_Status.w){
			if(this.sprite.y > 0) {
				this.sprite.y -= this.speed;
			}
		}if(Key_Status.a){
			if(this.sprite.x > 0) {
				this.sprite.x -= this.speed;
			}
		}if(Key_Status.s){
			this.sprite.update();
			if(this.sprite.y <= this.canvas.height - 100){
				this.sprite.y += this.speed;
			}
		}if(Key_Status.d){
			if(this.sprite.x <= this.canvas.width - 100) {
				this.sprite.x += this.speed;
			}
		}
		if(Key_Status.space){
			if(this.attack instanceof MeleeAttack){
				this.attack.draw();
			}
			if(this.attack instanceof  RangedAttack){
				this.attack.spawn(this.x+30, this.y+30, 10);
			}
		}
		this.sprite.draw(this.context);
	};
	this.draw = function () {
		this.move();
		if(this.attack instanceof MeleeAttack) {
			this.attack.spawn(this.x+80, this.y, 5);
		}
		if(this.attack instanceof RangedAttack){
			if(this.attack.active){
				this.attack.draw();
			}
		}
	};
}
function Enemey(img, attack) {
	Drawable.call(this, img);
	this.attack = attack;
	this.active = false;
	this.x = Math.floor(Math.random() * this.canvas.width);
	this.y = Math.floor(Math.random() * this.canvas.height);
	this.move = function(){

	};
	this.draw = function(){
		this.move();
		this.context.drawImage(this.sprite, this.x,this.y);
	};
}
function Attack(img) {
	Drawable.call(this,img);
	this.active = false;
	this.spawn = function (x,y,speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.active = true;
		this.context.drawImage(this.sprite, this.x, this.y);
	};
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.active = false;
	};
}
function RangedAttack(img){
	Attack.call(this, img);
	this.draw = function () {
		if(this.x < mouse.x){
			if(this.x + this.speed < mouse.x) {
				this.x += this.speed;
			}else{
				this.x = mouse.x;
			}
		}
		if(this.x > mouse.x){
			if(this.x - this.speed > mouse.x) {
				this.x -= this.speed;
			}else{
				this.x = mouse.x;
			}
		}
		if(this.y < mouse.y){
			if(this.y + this.speed < mouse.y) {
				this.y += this.speed;
			}else{
				this.y = mouse.y;
			}
		}
		if(this.y > mouse.y){
			if(this.y - this.speed > mouse.y){
				this.y -= this.speed;
			}else{
				this.y = mouse.y;
			}
		}
		if(this.x === mouse.x && this.y === mouse.y){
			this.active = false;
		}else{
			this.context.drawImage(this.sprite, this.x, this.y);
		}
	};
}
function MeleeAttack(img) {
	Attack.call(this, img);
	this.draw = function () {
		this.context.translate(this.x,this.y);
		this.context.rotate(90*Math.PI/180);
		this.context.translate(-this.x +70, -this.y -120);
		this.context.restore();
	};
}
function Game() {
	this.init = function () {
		this.canvas = $('#game');
		this.ctx = this.canvas.getContext('2d');
		Player.prototype.context = this.ctx;
		Player.prototype.canvas = this.canvas;
		Enemey.prototype.context = this.ctx;
		Enemey.prototype.canvas = this.canvas;
		Attack.prototype.context = this.ctx;
		Attack.prototype.canvas = this.canvas;
		RangedAttack.prototype.canvas = this.canvas;
		RangedAttack.prototype.context = this.ctx;
		MeleeAttack.prototype.canvas = this.canvas;
		MeleeAttack.prototype.context = this.ctx;
		this.wizard = new Player("img/Wizard.png", new RangedAttack("img/Ranged.png"), 2);
		this.knight = new Player("img/Knight.png", new MeleeAttack("img/Sword.png"), 2);
		this.characters = [this.wizard, this.knight];
		this.animate = function () {
			for(i = 0; i<this.characters.length; i++){
				var player = this.characters[i];
				if(player.active){
					player.draw();
				}
			}
		};
		this.switch = function(character){
			switch (character){
				case 0:
					this.wizard.active = true;
					this.knight.active = false;
					break;
				case 1:
					this.wizard.active = false;
					this.knight.active = true;
					break;
			}
		};
		this.clear = function () {
			this.canvas.width = this.canvas.width;
		};
		return true;
	};
}
var RPG = new Game();
RPG.init();
var Key_Codes = {
	32: 'space',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	87: 'w',
	65: 'a',
	83: 's',
	68: 'd'
};
var Key_Status = [];
var mouse = {x:0,y:0};
var bounds = RPG.canvas.getBoundingClientRect();
for(code in Key_Codes){
	Key_Status[Key_Codes[code]] = false;
}
document.onkeydown = function (e) {
	if(Key_Codes[e.keyCode]){
		e.preventDefault();
		Key_Status[Key_Codes[e.keyCode]] = true
	}
};
document.onkeyup = function (e) {
	if(Key_Codes[e.keyCode]){
		e.preventDefault();
		Key_Status[Key_Codes[e.keyCode]] = false;
	}
};
function mousePosition (e) {
	mouse.x = (e.clientX - bounds.left);
	mouse.y = (e.clientY - bounds.top);
};
RPG.canvas.addEventListener('mousemove',mousePosition, false);
function animate() {
	RPG.clear();
	RPG.animate();
}
setInterval(animate, 10);