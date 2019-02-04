function step(width, height, data) {
	const copy = [];

	for (let i = 0; i < width; i++) {
		const row = [];
		for (let j = 0; j < height; j++) {
			const widthIndexes = [(i + width - 1) % width, i, (i + 1) % width];
			const heightIndexes = [(j + height - 1) % height, j, (j + 1) % height];

			let sum = 0;
			widthIndexes.forEach(x => {
				heightIndexes.forEach(y => {
					if (!(i === x && j === y) && data[x][y]) {
						sum++;
					}
				});
			})

			row.push(data[i][j] ? sum === 2 || sum === 3 : sum === 3);
		}
		copy.push(row);
	}

	return copy;
}

function draw(context, cellSize, width, height, data, grid) {
	const fullWidth = width * cellSize;
	const fullHeight = height * cellSize;

	context.clearRect(0, 0, fullWidth, fullHeight);

	if (grid) {
		context.strokeStyle = "rgba(0, 0, 0, 1)";
		for (let i = 0; i < width + 1; i++) {
			context.beginPath();
			context.moveTo(i * cellSize, 0);
			context.lineTo(i * cellSize, fullHeight);
			context.stroke();
		}
		for (let j = 0; j < height + 1; j++) {
			context.beginPath();
			context.moveTo(0, j * cellSize);
			context.lineTo(fullWidth, j * cellSize);
			context.stroke();
		}
	}

	// Draw cells
	const gap = grid ? 1 : 0
	context.fillStyle = "rgba(0, 0, 0, 1)";
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			if (data[i][j]) {
				context.fillRect(i * cellSize + gap, j * cellSize + gap, cellSize - 2 * gap, cellSize - 2 * gap);
			}
		}
	}
}

function initRandom(width, height, threshold) {
	const data = [];

	for (let i = 0; i < width; i++) {
		let row = [];
		for (let j = 0; j < height; j++) {
			const value = Math.random() * 100 < threshold;
			row.push(value);
		}
		data.push(row);
	}

	return data;
}

function initCanvas(canvas, cellSize, width, height) {
	canvas.width = width * cellSize;
	canvas.height = height * cellSize;
}

function readValues() {
	return {
		threshold: Number(document.querySelector('#threshold-input').value),
		cellSize: Number(document.querySelector('#size-input').value),
		width: Number(document.querySelector('#width-input').value),
		height: Number(document.querySelector('#height-input').value),
		grid: document.querySelector('#grid-input').checked,
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	let frameId = null;

	const run = (loop) => {
		frameId = requestAnimationFrame(loop);
	}

	const stop = () => {
		cancelAnimationFrame(frameId);
	}

	let { threshold, cellSize, width, height, grid } = readValues();
	initCanvas(canvas, cellSize, width, height);
	let data = initRandom(width, height, threshold);

	document.querySelector("#play-button").addEventListener('click', () => {
		document.querySelector("#play-button").disabled = true;
		document.querySelector("#pause-button").disabled = false;
		run(loop)
	});

	document.querySelector("#pause-button").addEventListener('click', () => {
		stop();
		document.querySelector("#play-button").disabled = false;
		document.querySelector("#pause-button").disabled = true;
	});

	document.querySelector('#init-button').addEventListener('click', () => {
		stop();
		document.querySelector("#play-button").disabled = false;
		document.querySelector("#pause-button").disabled = true;

		const options = readValues();
		threshold = options.threshold;
		cellSize = options.cellSize;
		width = options.width;
		height = options.height;
		grid = options.grid;

		initCanvas(canvas, cellSize, width, height);
		data = initRandom(width, height, threshold);

		draw(context, cellSize, width, height, data, grid);
	});

	canvas.addEventListener('click', event => {
		const currentTargetRect = event.currentTarget.getBoundingClientRect();
		const i = Math.floor((event.pageX - currentTargetRect.left) / cellSize);
		const j = Math.floor((event.pageY - currentTargetRect.top) / cellSize);

		data[i][j] = !data[i][j];
		draw(context, cellSize, width, height, data, grid);
	});

	const loop = (timestamp) => {
		data = step(width, height, data);
		draw(context, cellSize, width, height, data, grid);

		run(loop);
	};

	run(loop);
});
