'use strict';

function divideSegment(a, b) {
	const [ax, ay] = a;
	const [bx, by] = b;

	const angle = Math.atan2((by - ay), (bx - ax)) + Math.PI / 3;
	const length = Math.sqrt(((bx - ax) / 3) ** 2 + ((by - ay) / 3) ** 2);

	const c = [(bx - ax) / 3 + ax, (by - ay) / 3 + ay];
	const d = [(bx - ax) / 3 + ax + length * Math.cos(angle), (by - ay) / 3 + ay + length * Math.sin(angle)];
	const e = [(bx - ax) * 2 / 3 + ax, (by - ay) * 2 / 3 + ay];

	return [c, d, e];
}

function computeDotsPositions(step, size, margin) {
	let dots = [
		[margin, size * Math.sqrt(3) / 2 + margin],
		[size + margin, size * Math.sqrt(3) / 2 + margin],
		[size / 2 + margin, margin],
		[margin, size * Math.sqrt(3) / 2 + margin]
	];

	for (let i = 0; i < step; i++) {
		let newDots = [];
		for (let j = 0; j < dots.length - 1; j++) {
			const a = dots[j];
			const b = dots[j + 1];
			const [c, d, e] = divideSegment(a, b);
			newDots = newDots.concat([a, c, d, e]);
		}
		newDots.push(dots[dots.length - 1]);
		dots = newDots;
	}

	return dots;
}

function draw(context, dots, computeStep, drawStep, dimensions) {
	context.clearRect(0, 0, dimensions.width, dimensions.height);
	const step =  4 ** (computeStep - drawStep);

	const [start, ...otherDots] = dots;
	context.beginPath();
	context.moveTo(...start);
	for (let i = step - 1; i < otherDots.length; i += step) {
		context.lineTo(...otherDots[i]);
	}
	context.stroke();
}

function computeDimensions(size, margin) {
	return {
		width: size + margin * 2,
		height: size * Math.sqrt(3) * 2 / 3 + margin * 2
	};
}

function initCanvas(canvas, width, height) {
	canvas.width = width;
	canvas.height = height;
}

function readValues() {
	return {
		step: Number(document.querySelector('#step-input').value),
		size: Number(document.querySelector('#size-input').value),
		animated: document.querySelector('#animated-input').checked,
		fps: Number(document.querySelector('#fps-input').value)
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	const margin = 10;
	let { step, size, animated, fps } = readValues();
	let dimensions = computeDimensions(size, margin);
	let dots = computeDotsPositions(step, size, margin);

	let drawStep = 0;
	const loop = new Loop(() => {
		draw(context, dots, step, drawStep, dimensions);
		drawStep++;
		if (drawStep === step) {
			loop.stop();
		}
	});

	document.querySelector('#draw-button').addEventListener('click', () => {
		loop.stop();

		const options = readValues();
		step = options.step;
		size = options.size;
		animated = options.animated;
		fps = options.fps;

		dimensions = computeDimensions(size, margin);
		initCanvas(canvas, dimensions.width, dimensions.height);
		dots = computeDotsPositions(step, size, margin);

		if (animated) {
			drawStep = 0;
			loop.start(fps);
		} else {
			draw(context, dots, step, step, dimensions);
		}
	});

	document.querySelector('#animated-input').addEventListener('change', function() {
		const element = document.querySelector('#fps-input');
		element.disabled = !this.checked;
		element.closest('.mdc-text-field').classList.toggle('mdc-text-field--disabled', !this.checked);
	});

	initCanvas(canvas, dimensions.width, dimensions.height);
	draw(context, dots, step, step, dimensions);
});
