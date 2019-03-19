function turn(width, height, x, y, orientation, direction) {
	if (orientation === 'top') {
		if (direction === 'right') {
			return [(x + 1) % width, y, 'right'];
		} else if (direction === 'left') {
			return [(x + width - 1) % width, y, 'left'];
		}
	} else if (orientation === 'left') {
		if (direction === 'right') {
			return [x, (y + height - 1) % height, 'top'];
		} else if (direction === 'left') {
			return [x, (y + 1) % height, 'bottom'];
		}
	} else if (orientation === 'right') {
		if (direction === 'right') {
			return [x, (y + 1) % height, 'bottom'];
		} else if (direction === 'left') {
			return [x, (y + height - 1) % height, 'top'];
		}
	} else if (orientation === 'bottom') {
		if (direction === 'right') {
			return [(x + width - 1) % width, y, 'left'];
		} else if (direction === 'left') {
			return [(x + 1) % width, y, 'right'];
		}
	}
}

function step(context, cellSize, width, height, movements, grid, ants) {
	const newAnts = [];
	const updatedCells = {};

	ants.forEach(([x, y, orientation]) => {
		const value = grid[x][y] !== null ? grid[x][y] : 0;
		grid[x][y] = (value + 1) % movements.length;

		if (!(x in updatedCells)) {
			updatedCells[x] = new Set();
		}

		updatedCells[x].add(y);

		const [direction,] = movements[grid[x][y]];
		const newAnt = turn(width, height, x, y, orientation, direction);
		newAnts.push(newAnt);
	});

	return {
		grid: grid,
		ants: newAnts,
		updatedCells: updatedCells
	};
}

function updatedDraw(context, cellSize, width, height, movements, grid, ants, updatedCells) {
	updatedCells.forEach(([x, y]) => {
		const value = grid[x][y];
		const [_, color] = movements[value];
		context.fillStyle = color;
		context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	});

	drawAnts(context, cellSize, ants);
}

function fullDraw(context, cellSize, width, height, movements, grid, ants) {
	const fullWidth = cellSize * width;
	const fullHeight = cellSize * height;
	context.clearRect(0, 0, fullWidth, fullHeight);

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const value = grid[i][j];
			const [direction, color] = value !== null ? movements[value] : [null, 'rgba(0, 0, 0, 0.2)'];
			context.fillStyle = color;
			context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
		}
	}

	drawAnts(context, cellSize, ants);
}

function drawAnts(context, cellSize, ants) {
	ants.forEach(([x, y, _]) => {
		context.fillStyle = 'rgb(255, 0, 0)';
		context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	});
}

function init(width, height) {
	const grid = [];

	for (let i = 0; i < width; i++) {
		grid.push(Array(height).fill(null));
	}

	return grid;
}

// function randomInit(width, height, movements) {
// 	const grid = [];

// 	for (let i = 0; i < width; i++) {
// 		const row = [];
// 		for (let j = 0; j < height; j++) {
// 			row.push(Math.floor(Math.random() * movements.length));
// 		}
// 		grid.push(row);
// 	}

// 	return grid;
// }

function initCanvas(canvas, cellSize, width, height) {
	canvas.width = cellSize * width;
	canvas.height = cellSize * height;
}

function readValues() {
	return {
		cellSize: Number(document.querySelector('#size-input').value),
		width: Number(document.querySelector('#width-input').value),
		height: Number(document.querySelector('#height-input').value),
		iterations: Number(document.querySelector('#iterations-input').value),
		fps: Number(document.querySelector('#fps-input').value)
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw').transferControlToOffscreen();
	const context = canvas.getContext('2d');

	let { cellSize, width, height, iterations, fps } = readValues();
	initCanvas(canvas, cellSize, width, height);
	// let ants = [[Math.round(width / 2) - 1, Math.round(height / 2) - 1, 'top']];
	let ants = [[Math.round(width / 2), Math.round(height / 2), 'top']];
	let grid = init(width, height);
	// let grid = randomInit(width, height, movements);

	const movements = [
		['left', 'rgb(0, 0, 0)'],
		['right', 'rgb(255, 255, 255)'],
	];
	// Cool movements
	// const movements = [
	// 	['left', 'rgb(0, 0, 0)'],
	// 	['left', 'rgb(0, 0, 255)'],
	// 	['left', 'rgba(255, 0, 0)'],
	// 	['right', 'rgb(0, 255, 0)'],
	// ];

	// const colors = {
	// 	'red_magenta': '#FF007F',
	// 	'red': '#FF0000',
	// 	'orange': '#FF7F00',
	// 	'yellow': '#FFFF00',
	// 	'green_yellow': '#7FFF00',
	// 	'green': '#00FF00',
	// 	'green_cyan': '#00FF7F',
	// 	'cyan': '#00FFFF',
	// 	'blue_cyan': '007FFFF',
	// 	'blue': '#0000FF',
	// 	'blue_magenta': '#7F00FF',
	// 	'magenta': '#FF00FF',
	// };

	// Thumbnails colors
	// const movements = [
	// 	['right', colors['blue_magenta']],
	// 	['right', colors['yellow']],
	// 	['right', colors['blue_cyan']],
	// 	['left', colors['cyan']], // Ok
	// 	['right', colors['red_magenta']],  // Outer surface
	// 	['left', colors['green']],
	// 	['left', colors['orange']],
	// 	['right', colors['red']],
	// 	['right', colors['blue']], // Inner surface
	// 	['right', colors['green_yellow']],
	// 	['right', colors['green_cyan']],
	// 	['right', colors['magenta']]
	// ];

	function mergeUpdates(container, updatedCells) {
		Object.keys(updatedCells).forEach(x => {
			const value = updatedCells[x];
			if (!(x in container)) {
				container[x] = new Set();
			}

			updatedCells[x].forEach(y => {
				container[x].add(y);
			});
		});
	}

	const loop = new Loop(() => {
			const updatedCells = {};
			for (let i = 0; i < iterations; i++) {
				const options = step(context, cellSize, width, height, movements, grid, ants);
				grid = options.grid;
				ants = options.ants;
				mergeUpdates(updatedCells, options.updatedCells);
			}

			const flatUpdatedCells = Object.keys(updatedCells).map(x => [...updatedCells[x]].map(y => [x, y])).flat();
			updatedDraw(context, cellSize, width, height, movements, grid, ants, flatUpdatedCells);
	});

	document.querySelector("#play-button").addEventListener('click', () => {
		document.querySelector("#play-button").disabled = true;
		document.querySelector("#pause-button").disabled = false;
		loop.start(fps);
	});

	document.querySelector("#pause-button").addEventListener('click', () => {
		loop.stop();
		document.querySelector("#play-button").disabled = false;
		document.querySelector("#pause-button").disabled = true;
	});

	document.querySelector('#init-button').addEventListener('click', () => {
		loop.stop();
		document.querySelector("#play-button").disabled = true;
		document.querySelector("#pause-button").disabled = false;

		const options = readValues();
		cellSize = options.cellSize;
		width = options.width;
		height = options.height;
		iterations = options.iterations;
		fps = options.fps;

		initCanvas(canvas, cellSize, width, height);
		ants = [[Math.round(width / 2), Math.round(height / 2), 'top']];
		grid = init(width, height);

		fullDraw(context, cellSize, width, height, movements, grid, ants);
		loop.start(fps);
	});

	document.querySelector('#fps-play-button').addEventListener('MDCTextField:icon', () => {
		document.querySelector("#play-button").disabled = true;
		document.querySelector("#pause-button").disabled = false;

		fps = readValues().fps;
		loop.stop();
		loop.start(fps);
	});

	document.querySelector('#ipf-play-button').addEventListener('MDCTextField:icon', () => {
		document.querySelector("#play-button").disabled = true;
		document.querySelector("#pause-button").disabled = false;

		iterations = readValues().iterations;
		loop.stop();
		loop.start(fps);
	});

	fullDraw(context, cellSize, width, height, movements, grid, ants);
	loop.start(fps);
});
