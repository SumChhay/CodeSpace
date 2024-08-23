const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const context = canvas.getContext('2d');

const codeReader = new ZXing.BrowserQRCodeReader();
const constraints = {
    video: {
        facingMode: 'environment'
    }
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(scanQRCode);
}).catch((err) => {
    console.error(err);
});

function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Image preprocessing
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            data[i] = brightness; // red
            data[i + 1] = brightness; // green
            data[i + 2] = brightness; // blue
        }
        context.putImageData(imageData, 0, 0);

        codeReader.decodeFromImage(canvas).then((result) => {
            console.log(result);
            document.getElementById('result').textContent = result.text;
        }).catch((err) => {
            console.error(err);
        });
    }
    requestAnimationFrame(scanQRCode);
}
