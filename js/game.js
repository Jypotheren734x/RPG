/**
 * Created by komar on 6/5/2017.
 */
function Sprite(img) {
	this.X = 10;
	this.Y = 10;
	this.Speed = 10;
	this.sprite = new Image();
	this.sprite.src = img;
}
function Player(img) {
	Sprite.call(this,img);
	this.attack = new Attack("img/Fireball-powerup.png");
	this.move = function () {
		if(Key_Status.w){
			if(this.Y > 0) {
				this.Y -= this.Speed;
			}
		}if(Key_Status.a){
			if(this.X > 0) {
				this.X -= this.Speed;
			}
		}if(Key_Status.s){
			if(this.Y <= this.canvas.height - 70){
				this.Y += this.Speed;
			}
		}if(Key_Status.d){
			if(this.X <= this.canvas.width - 60) {
				this.X += this.Speed;
			}
		}
	};
	this.draw = function () {
		this.context.drawImage(this.sprite, this.X, this.Y);
	};
}
function Attack(img) {
	Sprite.call(this,img);
	this.active = false;

}
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
function Game() {
	this.init = function () {
		this.canvas = $('#game');
		this.ctx = this.canvas.getContext('2d');
		Player.prototype.context = this.ctx;
		Player.prototype.canvas = this.canvas;
		this.wizard = new Player("img/Wizard_Male.png");
		this.start = function() {
			animate();
		};
		this.clear = function () {
			this.canvas.width = this.canvas.width;
		}
		return true;
	};
}
var RPG = new Game();
RPG.init();
RPG.start();
function animate() {
	RPG.clear();
	RPG.ctx.fillText("X: " + RPG.wizard.X + " Y: " + RPG.wizard.Y, 9, 9);
	RPG.wizard.move();
	RPG.wizard.draw();
}
setInterval(animate, 10);