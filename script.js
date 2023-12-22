const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function loadModel() {
    const model = await cocoSsd.load();
    return model;
}

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ 'video': true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function detectObjects(model, video) {
    const predictions = await model.detect(video);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    predictions.forEach((prediction) => {
        ctx.beginPath();
        ctx.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.stroke();
        ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
    });

    requestAnimationFrame(() => detectObjects(model, video));
}

async function run() {
    const model = await loadModel();
    await setupCamera();
    video.play();

    detectObjects(model, video);
}

run();
