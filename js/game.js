/**
 * Created by komar on 6/5/2017.
 */
function Sprite(img) {
	this.x = 10;
	this.y = 10;
	this.speed = 10;
	this.sprite = new Image();
	this.sprite.src = img;
}
function Player(img, attack) {
	Sprite.call(this,img);
	this.attack = attack;
	this.move = function () {
		if(Key_Status.w){
			if(this.y > 0) {
				this.y -= this.speed;
			}
		}if(Key_Status.a){
			if(this.x > 0) {
				this.x -= this.speed;
			}
		}if(Key_Status.s){
			if(this.y <= this.canvas.height - 70){
				this.y += this.speed;
			}
		}if(Key_Status.d){
			if(this.x <= this.canvas.width - 60) {
				this.x += this.speed;
			}
		}
		if(Key_Status.space){
			this.attack.spawn(this.x+30, this.y+30, 10);
		}
	};
	this.draw = function () {
		this.context.drawImage(this.sprite, this.x, this.y);
		this.move();
		if(this.attack.active){
			this.attack.draw();
		}
	};
}
function Attack(img) {
	Sprite.call(this,img);
	this.active = false;
	this.spawn = function (x,y,speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.active = true;
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
			this.x += this.speed;
		}
		if(this.x > mouse.x){
			this.x -= this.speed;
		}
		if(this.y < mouse.y){
			this.y += this.speed;
		}
		if(this.y > mouse.y){
			this.y -= this.speed;
		}
		if(this.x === mouse.x && this.y === mouse.y){
			this.active = false;
		}else{
			this.context.drawImage(this.sprite, this.x, this.y);
		}
	};
}
function Game() {
	this.init = function () {
		this.canvas = $('#game');
		this.ctx = this.canvas.getContext('2d');
		Player.prototype.context = this.ctx;
		Player.prototype.canvas = this.canvas;
		Attack.prototype.context = this.ctx;
		Attack.prototype.canvas = this.canvas;
		RangedAttack.prototype.canvas = this.canvas;
		RangedAttack.prototype.context = this.ctx;
		this.wizard = new Player("img/Wizard_Male.png", new RangedAttack("img/Fireball-powerup.png"));
		this.start = function() {
			animate();
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
RPG.start();
RPG.canvas.addEventListener('mousemove',mousePosition, false);
function animate() {
	RPG.clear();
	RPG.wizard.draw();
}
setInterval(animate, 10);