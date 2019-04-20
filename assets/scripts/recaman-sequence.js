function* recamanSequence(maxIteration) {
	const visited = new Set();
	let current = 0;

	for (let step = 0; step <= maxIteration; step++) {
		let candidate = current - step;
		if (candidate <= 0 || visited.has(candidate)) {
			candidate = current + step;
		}

		yield candidate;

		current = candidate;
		visited.add(current);
	}
}

function simpleDrawStep(options, currentIteration, isForward, startPoint, endPoint) {
	const { context, horizon, scale, margin, hueSpeed, hueStart } = options;
	const radius = (endPoint - startPoint) / 2;
	const center = startPoint + radius;

	const hue = (currentIteration * hueSpeed + hueStart) % 360;
	context.strokeStyle = `hsl(${hue}, 75%, 50%)`;

	const maxAngle = Math.min(Math.PI, endPoint / radius);

	// const hue = (count * colorScale + colorPadding) % 360;
	// context.strokeStyle = `hsl(${hue}, 75%, 50%)`;

	let startAngle = null;
	let endAngle = null;
	if (currentIteration % 2 === 0) {
		startAngle = Math.PI;
		endAngle = 2 * Math.PI;
		if (isForward) {
			// startAngle = Math.PI + startPoint / radius;
			// endAngle = Math.PI + maxAngle / radius;
		} else {
			// startAngle = 2 * Math.PI - startPoint / radius;
			// endAngle = 2 * Math.PI - maxAngle / radius;
		}
	} else {
		startAngle = 0;
		endAngle = Math.PI;
		if (isForward) {
			// startAngle = Math.PI - startPoint / radius;
			// endAngle = Math.PI - maxAngle;
		} else {
			// startAngle = startPoint / radius;
			// endAngle = maxAngle;
		}
	}

	context.beginPath();
	context.arc(margin + scale * center, horizon, scale * Math.abs(radius), startAngle, endAngle);
	context.stroke();
}

function animatedDrawStep(options, currentIteration, radius, center, isForward, startPoint, endPoint) {
	const { context, horizon, scale, margin, hueSpeed, hueStart } = options;
	// const radius = (endPoint - startPoint) / 2;
	// const center = startPoint + radius;

	const hue = (currentIteration * hueSpeed + hueStart) % 360;
	context.strokeStyle = `hsl(${hue}, 75%, 50%)`;

	const maxAngle = Math.min(Math.PI, endPoint / radius);

	// const hue = (count * colorScale + colorPadding) % 360;
	// context.strokeStyle = `hsl(${hue}, 75%, 50%)`;

	let startAngle = null;
	let endAngle = null;
	if (currentIteration % 2 === 0) {
		startAngle = Math.PI;
		endAngle = 2 * Math.PI;
		if (isForward) {
			// startAngle = Math.PI + startPoint / radius;
			// endAngle = Math.PI + maxAngle / radius;
		} else {
			// startAngle = 2 * Math.PI - startPoint / radius;
			// endAngle = 2 * Math.PI - maxAngle / radius;
		}
	} else {
		startAngle = 0;
		endAngle = Math.PI;
		if (isForward) {
			// startAngle = Math.PI - startPoint / radius;
			// endAngle = Math.PI - maxAngle;
		} else {
			// startAngle = startPoint / radius;
			// endAngle = maxAngle;
		}
	}

	context.beginPath();
	context.arc(margin + scale * center, horizon, scale * Math.abs(radius), startAngle, endAngle);
	context.stroke();
}

function computeMaxSizes(maxIteration, scale, margin) {
	const sequence = recamanSequence(maxIteration);
	let previous = sequence.next();
	let maxRadius = 0;
	let maxWidth = 0;
	for (let value of sequence) {
		const radius = Math.abs((value - previous) / 2);
		if (maxRadius < radius) {
			maxRadius = radius;
		}

		if (maxWidth < value) {
			maxWidth = value;
		}

		previous = value;
	}

	return [
		scale * maxWidth + margin * 2,
		scale * maxRadius * 2 + margin * 2
	];
}

function readValues() {
	return {
		scale: Number(document.querySelector('#scale-input').value),
		maxIteration: Number(document.querySelector('#max-iteration-input').value),
		animated: document.querySelector('#animated-input').checked,
		hueSpeed: Number(document.querySelector('#hue-speed-input').value),
		drawSpeed: Number(document.querySelector('#draw-speed-input').value),
	};
}

function initCanvas(canvas, width, height) {
	canvas.width = width;
	canvas.height = height;
}

function draw(canvas, context) {
	const margin = 10; // pixels
	const { scale, maxIteration, animated, hueSpeed, drawSpeed } = readValues();

	const [width, height] = computeMaxSizes(maxIteration, scale, margin);
	const horizon = height / 2;
	initCanvas(canvas, width, height);

	const generator = recamanSequence(maxIteration);
	const options = {
		context: context,
		scale: scale,
		horizon: horizon,
		margin: margin,
		hueSpeed: hueSpeed,
		hueStart: 0,
		drawSpeed: drawSpeed
	};

	let iteration = 1; // TODO: Is 1 a good value here? Not 0 or 2 maybe?
	let previous = generator.next();
	for (let value of generator) {
		simpleDrawStep(options, iteration, true, previous, value);
		iteration++;
		previous = value;
	}
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	let framedId = null;

	const run = (loop) => {
		framedId = requestAnimationFrame(loop);
	};

	const stop = () => {
		cancelAnimationFrame(framedId);
	};

	document.querySelector('#draw-button').addEventListener('click', () => {
		draw(canvas, context);

		// stop();
		// const { scale, maxIteration, animated, hueSpeed, drawSpeed } = readValues();

		// const [width, height] = computeMaxSizes(maxIteration, scale, margin);
		// const horizon = height / 2;
		// initCanvas(canvas, width, height);

		// const generator = recamanSequence(maxIteration);
		// const options = {
		// 	context: context,
		// 	scale: scale,
		// 	horizon: horizon,
		// 	margin: margin,
		// 	hueSpeed: hueSpeed,
		// 	hueStart: 0,
		// 	drawSpeed: drawSpeed
		// };

		// if (animated) {
		// 	let previousTimestamp = null;
		// 	let iteration = 2;
		// 	let currentProgress = 0;
		// 	let previous = generator.next();
		// 	let current = generator.next();
		// 	const loop = (timestamp) => {
		// 		if (previousTimestamp === null) { previousTimestamp = timestamp; }
		// 		const progress = timestamp - previousTimestamp;
		// 		previousTimestamp = timestamp;

		// 		const radius = Math.abs(current - previous) / 2;
		// 		const center = previous + (current - previous) / 2;
		// 		const perimeter = Math.PI * radius;

		// 		const remain = perimeter - currentProgress;

		// 		// TODO: Stop computation when done
		// 		run(loop);
		// 	};

		// 	run(loop);
		// } else {
		// 	let iteration = 1; // TODO: Is 1 a good value here? Not 0 or 2 maybe?
		// 	let previous = generator.next();
		// 	for (let value of generator) {
		// 		simpleDrawStep(options, iteration, true, previous, value);
		// 		iteration++;
		// 		previous = value;
		// 	}
		// }
	});

	draw(canvas, context);
});
