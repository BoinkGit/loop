class Player {
	constructor(x, y, sprite, char) {
		this.x = x;
		this.y = y;

		this.vx = 0; this.vy = 0;

		this.sprite = sprite;
		this.char = char;
		
		this.floor = false;
		
		this.floory = false;
		this.wallx = false;

		this.grav = .2;
		
		this.spt = 0;
		this.speed = .66;

		this.inBlock = (b, k) => {
			if (k) {
				return ((Math.abs(b.x - this.x) <  20) && (b.y - this.y > 5));
			} else {
				return ((Math.abs(b.x - this.x) <  20) && (Math.abs(b.y - this.y) < 25));
			}
		}

		this.spc = (ch) => {
			if (this.char == ch && this.spt > 0) {
				return true;
			}
		}
	}

	draw(ctx) {
		Sprite(ctx, sprites, this.sprite + 3*(this.spt > 0), [this.x, this.y]);
	}

	move() {
		let rah = 1;
		this.vx += (keys.has("d") - keys.has("a")) * this.speed * rah;
		if (keys.has("w") && this.char == 1 && this.floor) {this.vy = -3.5;}
		this.x += this.vx;
		this.vx *= .7;
		this.floor = false;

		if (this.x < 0) {this.x = 0;}
		if (this.x > 200) {this.x = 200;}

		if (!this.spc(0)) {
			blocks.forEach((b) => {
				if (!this.inBlock(b, false)) {return;}
				if (this.vx > 0) {
					this.x = b.x - 20;
				} else if (this.vx < 0) {this.x = b.x + 20;}
				this.vx = 0;
			});
		}

		this.y += this.vy;
		blocks.forEach((b) => {
			if (!this.inBlock(b, this.spc(0))) {return;}
			if (this.vy > 0) {
				this.floor = true;
				this.y = b.y - 25;

			} else if (this.vy < 0) {
				this.y = b.y + 25;
			}
			if (this.floor && (this.char != b.type)) {
				let rah
				switch (b.type) {
					case 0:
						rah = .5;
						break;
					case 2:
						//this.x = 25 * Math.floor(Math.random() * 9);
						break;
					default:
						break;
						
				}
			}
			if (b.type == 1 && this.vy > 1 && this.char != 1) {
				this.vy *= -.8;
			} else {
				this.vy = 0;
			}
			
		});

		if (!this.floor) {
			this.vy += this.grav;
		}
	}

	break() {
		if (!keys.has("s")) {return;}
		keys.delete("s");
		blocks.forEach((b) => {
			if (this.char == b.type) {
				if ((b.x == 25*Math.round(this.x/25)) && (b.y-25 == 25*Math.round(this.y/25))) {
					blocks.delete(b);
					score += 50;
				}
			}
		});
	}

	special() {
		if (this.spt > -200) {
			let iN = false;
			blocks.forEach((b) => {if (this.inBlock(b, false)) {iN = true;}})
			if (!iN || this.spt > 1) {
				this.spt--;
			}
			
		}

		if (this.spt <= 0) {
			switch (this.spell) {
				case 2:
				case 3:
				case 4:
					this.grav = .2;
					break;
				default:
					break;
			}
		}

		if (keys.has("w") && this.spt <= -200) {
			switch (this.char) {
				case 1:
					break;
				case 2:
					this.spell = Math.floor(Math.random() * 6);
					switch (this.spell) {
						case 0:
						case 1:
							timer = 200;
							break;
						case 2:
						case 3:
						case 4:
							this.grav = -.003;
							break;
						case 5:
							let a = true;
							blocks.forEach((b) => {
								if (a && Math.floor(Math.random() * 50) == 3) {
									a = false;
									blocks.delete(b);
								}
							});
							break;
						default:
							break;
					}
					
				default: 
					this.spt = 200;
					break;
			}
		}
	}
}