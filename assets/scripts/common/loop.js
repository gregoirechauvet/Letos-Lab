class Loop {
	frameId = null;
	previousTimestamp = null;

	constructor(loop) {
		this.loop = loop;
	}

	start(fps) {
		this.delay = 1000 / fps;
		this.run();
	}

	stop() {
		cancelAnimationFrame(this.frameId);
	}

	run() {
		this.frameId = requestAnimationFrame(this.innerLoop.bind(this));
	}

	innerLoop(timestamp) {
		this.run();

		if (this.previousTimestamp === null) { this.previousTimestamp = timestamp; }
		const delta = timestamp - this.previousTimestamp;

		if (delta > this.delay) {
			this.previousTimestamp = timestamp;
			this.loop();
		}
	}
}
