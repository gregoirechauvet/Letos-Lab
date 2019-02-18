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
	const updatedCells = {};

	const newAnts = [];
	ants.forEach(([x, y, orientation]) => {
		grid[x][y] = (grid[x][y] + 1) % movements.length;
		const [direction, color] = movements[grid[x][y]];

		if (!(x in updatedCells)) {
			updatedCells[x] = new Set();
		}

		updatedCells[x].add(y);

		// context.fillStyle = color;
		// context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

		const hop = turn(width, height, x, y, orientation, movements[grid[x][y]][0]);
		newAnts.push(hop);
	});

	return {
		grid: grid,
		ants: newAnts,
		updatedCells: updatedCells
		// updatedCells: updatedCells.map(x => {
		// 	return updatedCells[x].values().map(y => {

		// 	});
		// }).flat();
	};
}

function fullDraw(context, cellSize, width, height, movements, grid, ants) {
	const fullWidth = cellSize * width;
	const fullHeight = cellSize * height;
	context.clearRect(0, 0, fullWidth, fullHeight);

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const [direction, color] = movements[grid[i][j]];
			context.fillStyle = color;
			context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
		}
	}

	ants.forEach(([x, y, _]) => {
		context.fillStyle = 'rgb(255, 0, 0)';
		context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	});
}

function init(width, height) {
	const grid = [];

	for (let i = 0; i < width; i++) {
		const row = [];
		for (let j = 0; j < height; j++) {
			row.push(0);
		}
		grid.push(row);
	}

	return grid;
}

function randomInit(width, height, movements) {
	const grid = [];

	for (let i = 0; i < width; i++) {
		const row = [];
		for (let j = 0; j < height; j++) {
			row.push(Math.floor(Math.random() * movements.length));
		}
		grid.push(row);
	}

	return grid;
}

function initCanvas(canvas, cellSize, width, height) {
	canvas.width = cellSize * width;
	canvas.height = cellSize * height;
}

function readValues() {
	return {
		cellSize: Number(document.querySelector('#size-input').value),
		width: Number(document.querySelector('#width-input').value),
		height: Number(document.querySelector('#height-input').value),
		iterations: Number(document.querySelector('#iterations-input').value)
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw').transferControlToOffscreen();
	const context = canvas.getContext('2d');

	let { cellSize, width, height, iterations } = readValues();
	initCanvas(canvas, cellSize, width, height);
	let ants = [[50, 50, 'top']];
	let grid = init(width, height);

	const movements = [
		['right', 'rgb(0, 0, 0)'],
		['left', 'rgb(255, 255, 255)'],
	];
	// let grid = randomInit(width, height, movements);

	fullDraw(context, cellSize, width, height, movements, grid, ants);

	document.querySelector('#init-button').addEventListener('click', () => {

	});

	let play = true;

	const loop = (timestamp) => {
		for (let i = 0; i < iterations; i++) {
			const options = step(context, cellSize, width, height, movements, grid, ants);
			grid = options.grid;
			ants = options.ants;
		}
		// fullDraw(context, cellSize, width, height, movements, grid, ants);

		if (play) {
			requestAnimationFrame(loop);
		}
	};

	requestAnimationFrame(loop);
});
