function draw(context, width, height, size, data) {
	const [xWalls, yWalls, visited, history] = data;

	context.clearRect(0, 0, width * size, height * size);
	context.lineWidth = 2;

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height - 1; j++) {
			if (xWalls[i][j]) {
				context.beginPath();
				context.moveTo(i * size, (j + 1) * size);
				context.lineTo((i + 1) * size, (j + 1) * size);
				context.stroke();
				context.closePath();
			}
		}
	}
	for (let i = 0; i < width - 1; i++) {
		for (let j = 0; j < height; j++) {
			if (yWalls[i][j]) {
				context.beginPath();
				context.moveTo((i + 1) * size, j * size);
				context.lineTo((i + 1) * size, (j + 1) * size);
				context.stroke();
				context.closePath();
			}
		}
	}

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(width * size, 0);
	context.lineTo(width * size, height * size);
	context.lineTo(0, height * size);
	context.lineTo(0, 0);
	context.stroke();
	context.closePath();
}

function unvisitedNeighboors(width, height, currentPosition, visited) {
	const [x, y] = currentPosition;
	const output = [];
	[[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].forEach(([a, b]) => {
		if (a >= 0 && a < width && b >= 0 && b < height && !visited[a][b]) {
			output.push([a, b]);
		}
	});

	return output;
}

function chooseItem(random, items) {
	const randomIndex = Math.floor(random() * items.length);
	return items[randomIndex];
}

function step(width, height, random, data, currentPosition) {
	const [xWalls, yWalls, visited, start] = data;

	let neighboors = unvisitedNeighboors(width, height, currentPosition, visited);

	if (neighboors.length === 0) {
		choices = [];
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				if (visited[i][j] && unvisitedNeighboors(width, height, [i, j], visited).length > 0) {
					choices.push([i, j]);
				}
			}
		}
		if (choices.length > 0) {
			currentPosition = chooseItem(random, choices);
			neighboors = unvisitedNeighboors(width, height, currentPosition, visited);
		} else {
			return null;
		}
	}

	const neighboor = chooseItem(random, neighboors);
	if (neighboor[0] == currentPosition[0]) {
		const y = Math.min(neighboor[1], currentPosition[1]);
		xWalls[neighboor[0]][y] = false;
	} else {
		const x = Math.min(neighboor[0], currentPosition[0]);
		yWalls[x][neighboor[1]] = false;
	}

	currentPosition = neighboor;
	visited[currentPosition[0]][currentPosition[1]] = true;

	return currentPosition;
}

function generate(width, height, random, data) {
	const [xWalls, yWalls, visited, start] = data;
	let currentPosition = start;

	while (true) {
		currentPosition = step(width, height, random, data, currentPosition);

		if (currentPosition === null) {
			break ;
		}
	}
}

function init(width, height) {
	const xWalls = [];
	for (let i = 0; i < width; i++) {
		xWalls.push(Array(height - 1).fill(true));
	}

	const yWalls = [];
	for (let i = 0; i < width - 1; i++) {
		yWalls.push(Array(height).fill(true));
	}

	const visited = [];
	for (let i = 0; i < width; i++) {
		visited.push(Array(height).fill(false));
	}

	const start = [0, 0];
	visited[start[0]][start[1]] = true;

	return [xWalls, yWalls, visited, start];
}

function initCanvas(canvas, width, height, size) {
	canvas.width = width * size;
	canvas.height = height * size;
}

function generateSeed() {
	// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
	let seed = '';
	const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	for (let i = 0; i < 10; i++) {
		seed += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return seed;
}

function initRandom(seed) {
	return new Math.seedrandom(seed);
}

function readValues() {
	return {
		width: Number(document.querySelector('#width-input').value),
		height: Number(document.querySelector('#height-input').value),
		size: Number(document.querySelector('#size-input').value),
		animation: document.querySelector('#animation-input').checked,
		autoSeed: document.querySelector('#auto-seed-input').checked,
		userSeed: document.querySelector('#seed-input').value
	};
}

function saveSeed(seed) {
	document.querySelector('#seed-input').value = seed;
}

function b64toBlob(dataURI) {
	// https://stackoverflow.com/questions/27980612/converting-base64-to-blob-in-javascript
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}

function availableNeighboors(width, height, currentPosition, visited, xWalls, yWalls) {
	const [x, y] = currentPosition;
	const output = [];
	[[x - 1, y, xWalls], [x + 1, y, xWalls], [x, y - 1, yWalls], [x, y + 1, yWalls]].forEach(([a, b, walls]) => {
		if (a >= 0 && a < width && b >= 0 && b < height && !visited[a][b] && !walls[a][b]) {
			output.push([a, b]);
		}
	});

	return output;
}

function solve(width, height, data) {
	const [xWalls, yWalls, visited, start] = data;
	let currentPosition = start;
	const history = [currentPosition];
	// console.log(availableNeighboors(width, height, currentPosition, visited.map(hop => hop.map(() => false)), xWalls, yWalls));
}

function isSolvable(state) {
	document.querySelector('#solve-button').disabled = !state;
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	let frameId = null;
	let data = null;

	const cancel = () => {
		cancelAnimationFrame(frameId);
	}

	const run = (loop) => {
		frameId = requestAnimationFrame(loop);
	}

	const hop = () => {
		cancel();

		const { width, height, animation, autoSeed, userSeed, size } = readValues();
		// const data = init(width, height);
		data = init(width, height);

		const seed = autoSeed ? generateSeed() : userSeed;
		if (autoSeed) { saveSeed(seed); }
		const random = initRandom(seed);
		initCanvas(canvas, width, height, size);

		if (animation) {
			isSolvable(false);
			const [xWalls, yWalls, visited, start] = data;
			let currentPosition = start;

			const loop = (timestamp) => {
				currentPosition = step(width, height, random, data, currentPosition);
				draw(context, width, height, size, data);

				if (currentPosition !== null) {
					run(loop);
				} else {
					isSolvable(true);
				}
			}

			run(loop);
		} else {
			generate(width, height, random, data);
			draw(context, width, height, size, data);
			isSolvable(true);
		}
	}

	document.querySelector('#generate-button').addEventListener('click', () => {
		hop();
	});

	document.querySelector('#solve-button').addEventListener('click', () => {
		const { width, height, animation, autoSeed, userSeed, size } = readValues();
		solve(width, height, data);
	});

	document.querySelector('#auto-seed-input').addEventListener('change', function() {
		const element = document.querySelector('#seed-input');
		element.disabled = this.checked;
		element.closest('.mdc-text-field').classList.toggle('mdc-text-field--disabled', this.checked);
	});

	document.querySelector('#download-button').addEventListener('click', () => {
		// Chrome is preventing to open base64 files programmatically
		// The workaround is to use a blob
		const blob = b64toBlob(canvas.toDataURL());
		window.open(URL.createObjectURL(blob));
	});

	hop();
});
