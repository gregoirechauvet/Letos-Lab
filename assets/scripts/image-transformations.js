'use strict';

function photomatonTransformation(width, height, x, y) {
	return [
		x / 2 + ((width + (width % 2) - 1) / 2) * (x % 2),
		y / 2 + ((height + (height % 2) - 1) / 2) * (y % 2)
	];
}

function reversePhotomatonTransformation(width, height, x, y) {
	const a = x < width / 2 ? 0 : 1;
	const b = y < height / 2 ? 0 : 1;

	return [
		2 * x - (width + (width % 2) - 1) * a,
		2 * y - (height + (height % 2) - 1) * b
	];
}

function bakerTransformation(width, height, x, y) {
	x = x * 2 + (y % 2);
	y = (y - (y % 2)) / 2;

	if (x > width - 1) {
		return [2 * width - 1 - x, height - 1 - y];
	}

	return [x, y];
}

function reverseBakerTransformation(width, height, x, y) {
	if (y >= height / 2) {
		x = 2 * width - 1 - x;
		y = height - 1 - y;
	}

	return [
		(x - (x % 2)) / 2,
		2 * y + (x % 2)
	];
}

function hilbertTransformation(width, height, x, y) {
	return [
		x, ((y - x) + height) % height
	];
}

function reverseHilbertTransformation(width, height, x, y) {
	return [
		x, (y + x) % height
	];
}

function step(context, width, height, imageData, transformation) {
	const newImageData = context.createImageData(width, height);

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const [newX, newY] = transformation(width, height, x, y);

			const oldIndex = (x + y * width) * 4;
			const newIndex = (newX + newY * width) * 4;
			newImageData.data[newIndex] = imageData.data[oldIndex];
			newImageData.data[newIndex + 1] = imageData.data[oldIndex + 1];
			newImageData.data[newIndex + 2] = imageData.data[oldIndex + 2];
			newImageData.data[newIndex + 3] = imageData.data[oldIndex + 3];
		}
	}

	return newImageData;
}

function initCanvas(canvas, width, height) {
	canvas.width = width;
	canvas.height = height;
}

function init(canvas, context) {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.addEventListener('load', () => {
			const width = img.width;
			const height = img.height;
			initCanvas(canvas, width, height)

			context.drawImage(img, 0, 0);
			const imageData = context.getImageData(0, 0, width, height);

			resolve({ width: width, height: height, imageData: imageData });
		});

		img.src = '/image-transformations/lena.png';
	});
}

function readValues() {
	const select = document.querySelector('#transformation-input');
	return {
		transformation: select.options[select.selectedIndex].value,
		fps: Number(document.querySelector('#fps-input').value)
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	const transformationsMap = {
		photomaton: [photomatonTransformation, reversePhotomatonTransformation],
		baker: [bakerTransformation, reverseBakerTransformation],
		hilbert: [hilbertTransformation, reverseHilbertTransformation]
	};

	let width, height, imageData;
	let { transformation, fps } = readValues();

	const backward = () => {
		const func = transformationsMap[transformation][1];
		imageData = step(context, width, height, imageData, func);
		context.putImageData(imageData, 0, 0);
	};

	const forward = () => {
		const func = transformationsMap[transformation][0];
		imageData = step(context, width, height, imageData, func);
		context.putImageData(imageData, 0, 0);
	};

	const loop = new Loop(forward);

	document.querySelector('#play-button').addEventListener('click', () => {
		document.querySelector("#play-button").disabled = true;
		document.querySelector("#pause-button").disabled = false;
		loop.start(fps);
	});

	document.querySelector('#pause-button').addEventListener('click', () => {
		loop.stop();
		document.querySelector("#play-button").disabled = false;
		document.querySelector("#pause-button").disabled = true;
	});

	document.querySelector('#previous-button').addEventListener('click', () => {
		backward();
	});

	document.querySelector('#next-button').addEventListener('click', () => {
		forward();
	});

	document.querySelector('#transformation-input').addEventListener('change', () => {
		init(canvas, context).then(data => {
			transformation = readValues().transformation;

			width = data.width;
			height = data.height;
			imageData = data.imageData;
		});
	});

	document.querySelector('#fps-play-button').addEventListener('MDCTextField:icon', () => {
		document.querySelector("#play-button").disabled = true;
		document.querySelector("#pause-button").disabled = false;

		fps = readValues().fps;
		loop.stop();
		loop.start(fps);
	});

	init(canvas, context).then(data => {
		width = data.width;
		height = data.height;
		imageData = data.imageData;

		loop.start(fps);
	});
});
