// From stackoverflow:
function hslToRgb(h, s, l) {
	let r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p, q, t) => {
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function draw(context, width, height, threshold, lines) {
	ratio = 1 / threshold;
	const imageData = context.createImageData(width, height);

	lines.forEach((rows, i) => {
		rows.forEach((row, j) => {
			const [n, a2, b2] = row;
			const key = (width * i + j) * 4;
			imageData[key + 3] = 255;

			if (n !== threshold) {
				const [r, b, g] = pickColor(threshold, n, a2, b2);
				imageData.data[key] = r;
				imageData.data[key + 1] = g;
				imageData.data[key + 2] = b;
			}

			// const [r, b, g] = hslToRgb(row * ratio, 1, 0.5);
			// imageData.data[key] = row === threshold ? 0 : r;
			// imageData.data[key + 1] = row === threshold ? 0 : g;
			// imageData.data[key + 2] = row === threshold ? 0 : b;
			// imageData.data[key + 3] = 255;
		});
	});

	context.putImageData(imageData, 0, 0);
}

const logBase = 1.0 / Math.log(2.0);
const logHalfBase = Math.log(0.5)*logBase;

function smoothColor(n, a2, b2) {
	return 5 + n - logHalfBase - Math.log(Math.log(a2 + b2)) * logBase;
}

function pickColor(threshold, n, a2, b2) {
	const smooth = smoothColor(n, a2, b2);
	// Swap red and blue
	const [blue, green, red] = hslToRgb(smooth / threshold, 1, 0.5);
	return [red, green, blue, 255];

}

function computePixel(x, y, threshold) {
	const max = Math.max(4, x ** 2 + y ** 2);
	let [a, b] = [x, y];
	let [a2, b2] = [a ** 2, b ** 2];
	let n = 0;
	while (n < threshold && a2 + b2 < max) {
		[a, b] = [a2 - b2 + x, 2 * a * b + y];
		[a2, b2] = [a ** 2, b ** 2];
		n++;
	}
	return [n, a2, b2];
}

function computeAll(width, height, threshold, lowerAbscissa, upperAbscissa, lowerOrdinate, upperOrdinate) {
	const abscissaRatio = (upperAbscissa - lowerAbscissa) / width;
	const ordinateRatio = (upperOrdinate - lowerOrdinate) / height;

	const rows = [];
	for (let i = 0; i < width; i++) {
		const lines = [];
		for (let j = 0; j < height; j++) {
			const x = (i + 0.5) * abscissaRatio + lowerAbscissa;
			const y = (j + 0.5) * ordinateRatio + lowerOrdinate;

			const hop = computePixel(x, y, threshold);
			lines.push(hop);
		}
		rows.push(lines);
	}

	return rows;
}

function readValues() {
	return {
		threshold: Number(document.querySelector('#threshold-input').value),
		width: Number(document.querySelector('#width-input').value),
		lowerAbscissa: Number(document.querySelector('#lower-abscissa-input').value),
		upperAbscissa: Number(document.querySelector('#upper-abscissa-input').value),
		lowerOrdinate: Number(document.querySelector('#lower-ordinate-input').value),
		upperOrdinate: Number(document.querySelector('#upper-ordinate-input').value),
	};
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	document.querySelector('#draw-button').addEventListener('click', () => {
		const {threshold, width, lowerAbscissa, upperAbscissa, lowerOrdinate, upperOrdinate} = readValues();
		const height = width * (upperOrdinate - lowerOrdinate) / (upperAbscissa - lowerAbscissa);

		const pixels = computeAll(width, height, threshold, lowerAbscissa, upperAbscissa, lowerOrdinate, upperOrdinate);
		canvas.width = width;
		canvas.height = height;
		draw(context, width, height, threshold, pixels);
	});
});
