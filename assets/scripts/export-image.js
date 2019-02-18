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

function openImageInNewTab(canvas) {
	// Chrome is preventing to open base64 files programmatically
	// The workaround is to use a blob
	const blob = b64toBlob(canvas.toDataURL());
	window.open(URL.createObjectURL(blob));
}
