function initCanvas(canvas, width, height) {
	canvas.width = width;
	canvas.height = height;
}

function readValues() {
	return {
		width: Number(document.querySelector('#width-input').value),
		height: Number(document.querySelector('#height-input').value),
	};
}

function draw(context, width, height) {

}

function loadData(callback) {
	fetch('/waveform/ex-machina.json')
		.then(response => console.log(response.json()));
	// let xhr = new XMLHttpRequest();
	// xhr.overrideMimeType('application/json');
	// xhr.open('GET', '/waveform/ex-machina.json');
	// xhr.onreadystatechange = function() {
	// 	if (xhr.readyState === 4 && xhr.status === 200) {
	// 		callback(xhr);
	// 	}
	// };
	// xhr.send(null);
}

window.addEventListener('load', () => {
	const canvas = document.querySelector('#draw');
	const context = canvas.getContext('2d');

	loadData(response => {
		console.log(response);
	});
});
