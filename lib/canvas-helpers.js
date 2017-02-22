import {
    getCachedSvgUrl
} from './body-inliner';

const clearCanvas = (canvas) => {
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
};

const drawSvgToCanvasAsync = (canvas, window, parentElement) => {
    const svgUrl = getCachedSvgUrl(parentElement, window);

    return new Promise((resolve, reject) => {
        const context = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            clearCanvas(canvas);
            context.drawImage(img, 0, 0);

            resolve();
        };

        img.onerror = () => {
            reject('Could not load image!');
        };

        img.src = svgUrl;
    });
};

const drawWhereYouAtWindow = (parentElement, canvas) => {
    const context = canvas.getContext('2d');
    const rectStartY = parentElement.scrollTop;
    const rectWidth = parentElement.clientWidth;
    const rectHeight = parentElement.clientHeight;

    context.globalCompositeOperation = 'darken';
    context.fillStyle = 'grey';
    context.fillRect(0, rectStartY, rectWidth, rectHeight);
};

export {
    drawSvgToCanvasAsync,
    drawWhereYouAtWindow
};
