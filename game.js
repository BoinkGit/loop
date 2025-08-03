const screen = document.getElementById("game");
const ctx = screen.getContext("2d");

const sprites = new Image();
sprites.src = "spritesheet.png"

const bgStart = new Audio("bgStart.wav");
const bgLoop = new Audio("bgLoop.wav");

const Sprite = (ctx, sheet, i, pos) => {
	let columns = sheet.width / 25;
	ctx.drawImage(sheet, (i % columns) * 25, Math.floor(i / columns) * 25, 25, 25, pos[0], pos[1], 25, 25)
};

const WIDTH = 225;
const HEIGHT = 400;

const keys = new Set()
document.addEventListener("keydown", (e) => {if (!e.repeat) {keys.add(e.key);}});
document.addEventListener("keyup", (e) => {keys.delete(e.key);});

let song;
let playing = false;
let runs = 9;
let score = 0;
let timer = 2000;
let level = 1;
const you = new Player(100, -50, 3, 0)


const blocks = new Set();

for (let i = 0; i < 9; i++) {
	for (let j = 6; j < 14; j++) {
		blocks.add(new Block(i, j, Math.floor(Math.random()*3)));
	}
}

tick = setInterval(() => {
if (!playing) {
	playing = (keys.size > 0);
	if (keys.size > 0) {
		song = Math.floor(bgStart.duration * 100);
		bgStart.play();
	}

	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	for (let i = 0; i < 9; i++) {
		Sprite(ctx, sprites, 9, [i*25, 0]);
		Sprite(ctx, sprites, 9, [i*25, 25]);
		Sprite(ctx, sprites, 9, [i*25, 50]);
		Sprite(ctx, sprites, 9, [i*25, 75]);
		Sprite(ctx, sprites, 9, [i*25, 100]);
		Sprite(ctx, sprites, 10, [i*25, 125]);
	}
	Sprite(ctx, sprites, 3, [25, 25]);
	ctx.fillText("breaks", 45, 40, 30)
	Sprite(ctx, sprites, 0, [75, 25]);

	Sprite(ctx, sprites, 4, [25, 60]);
	ctx.fillText("breaks", 45, 75, 30)
	Sprite(ctx, sprites, 1, [75, 60]);

	Sprite(ctx, sprites, 5, [25, 95]);
	ctx.fillText("breaks", 45, 110, 30)
	Sprite(ctx, sprites, 2, [75, 95]);

	ctx.fillText("A and D to move,", 110, 40);
	ctx.fillText("S to break,", 125, 75);
	ctx.fillText("and W for special!", 110, 110);
} else {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.font = '10px sans-serif';
	if (song <= 0) {
		bgLoop.play();
		song = Math.floor(bgLoop.duration*100) + 10;
	}	


	for (let i = 0; i < 9; i++) {
		Sprite(ctx, sprites, 10, [i*25, 0]);
	}

	ctx.fillText(`Swap in ${Math.ceil(timer/100)}s`, 10, 10);
	ctx.fillText(`Score: ${score}`, 170, 10, 100);
	ctx.fillText(`Level: ${level}`, 170, 20, 100);
	ctx.fillText(`Cycles left: ${Math.ceil(runs/3)}`, 80, 10, 500);

	you.break();
	you.special();
	you.move();

	if (runs == 0) {
		runs = 9;
		level++;
		for (let i = 0; i < 9; i++) {
			for (let j = 6; j < 14; j++) {
				blocks.add(new Block(i, j, Math.floor(Math.random()*3)));
			}
		}
	}

	if (you.y >= 450 || timer <= 0 || runs == 0) {
		keys.delete("q")
		if (you.y >= 450) {
			score += 1000;
		}
		you.y =-50; you.x = 100;
		you.vy = 0; you.vx = 0;
		timer = 2000;
		runs--;
		if (you.char > 1) {
			you.char = 0;
			you.sprite = 3;
		} else {
			you.char++;
			you.sprite++;
		}
	}
	
	blocks.forEach( (b) => {
		b.draw(ctx);}
	);
	
	you.draw(ctx);
	timer--;
	song--;
}
}, 10);
