class Block {
	constructor(x, y, type) {
		this.x = x * 25;
		this.y = y * 25;
		this.type = type;
	}

	draw(ctx) {
		Sprite(ctx, sprites, this.type, [this.x, this.y]);
	}
}