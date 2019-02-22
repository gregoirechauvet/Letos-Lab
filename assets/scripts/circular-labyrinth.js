function draw(context, data) {

}

function step() {

}

function initData() {
	const { spiresNumber, size } = readValues();

	const sideWalls = [];
	for (let i = 0; i < size - 1; i++) {
		// TODO: Put this formula somewhere else
		const innerSize = (i + 3) + (i % 2);
		sideWalls.push(Array(innerSize).fill(true));
	}

	const circularWalls = [[true, true, true]];
	for (let i = 0; i < size; i++) {
		const wallCount = 2 * (i + 3);
		circularWalls.push(Array(wallCount).fill(true));
	}

	const visited = [];
	for (let i = -1; i < size - 1; i++) {
		const innerSize = (i + 3) + (i % 2);
		visited.push(Array(innerSize).fill(false));
	}

	// visited[start[0]][start[1]] = true;
}

function initCanvas(canvas, width, height) {
	canvas.width = width;
	canvas.height = height;
}

function readValues() {
	return {
		spiresNumber: Number(document.querySelector('#number-input').value),
		size: Number(document.querySelector('#size-input').value),
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	let frameId = null;

	const stop = () => {
		cancelAnimationFrame(frameId);
	}

	const run = (loop) => {
		frameId = requestAnimationFrame(loop);
	}

	document.querySelector('#generate-button').addEventListener('click', () => {

	});
});
