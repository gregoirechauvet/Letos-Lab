'use strict';

function computeWidth(height) {
	return height * 2 - 1;
}

function initData(width, height) {
	const data = [];

	for (let i = 0; i < width; i++) {
		data.push(Array(height).fill(false));
	}

	return data;
}

function initCanvas(canvas, size, width, height) {
	canvas.width = width * size;
	canvas.height = height * size;
}

function rule(topLeft, top, topRight) {
	const rules = [
		[[true, true, true], false],
		[[true, true, false], false],
		[[true, false, true], false],
		[[true, false, false], true],
		[[false, true, true], true],
		[[false, true, false], true],
		[[false, false, true], true],
		[[false, false, false], false],
	];

	// Spierpinski rules
	// const rules = [
	// 	[[true, true, true], false],
	// 	[[true, true, false], true],
	// 	[[true, false, true], false],
	// 	[[true, false, false], true],
	// 	[[false, true, true], true],
	// 	[[false, true, false], false],
	// 	[[false, false, true], true],
	// 	[[false, false, false], false],
	// ];

	const [_, output] = rules.find(([previousState, output]) => {
		const [a, b, c] = previousState;
		return topLeft === a && top === b && topRight === c;
	});

	return output;
}

function step(width, height, data, currentStep) {
	const previousStep = currentStep - 1;
	for (let i = 0; i < width; i++) {
		const topRight = i > 1 ? data[i - 1][previousStep] : false;
		const top = data[i][previousStep];
		const topLeft = i < width - 1 ? data[i + 1][previousStep] : false;
		data[i][currentStep] = rule(topRight, top, topLeft);
	}
}

function draw(context, size, width, height, data) {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			if (data[i][j]) {
				context.fillRect(i * size, j * size, size, size);
			}
		}
	}
}

function compute(data, width, height) {
	data[Math.floor(width / 2)][0] = true;

	for (let i = 1; i < height; i++) {
		step(width, height, data, i);
	}
}

function readValues() {
	return {
		size: Number(document.querySelector("#size-input").value),
		height: Number(document.querySelector("#height-input").value)
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	let { size, height } = readValues();
	let width = computeWidth(height);
	let data = initData(width, height);

	initCanvas(canvas, size, width, height);
	compute(data, width, height);
	draw(context, size, width, height, data);

	document.querySelector("#draw-button").addEventListener('click', () => {
		const options = readValues();
		size = options.size;
		height = options.height;

		let width = computeWidth(height);
		let data = initData(width, height);

		initCanvas(canvas, size, width, height);
		compute(data, width, height);
		draw(context, size, width, height, data);
	});
});
