const canvasHelpersFactory = (getImage) => {
    const clearCanvas = (canvas) => {
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const drawSvgToCanvas = (getCachedSvgUrl, canvas, parentElement, callback) => {
        const image = getImage();
        const svgUrl = getCachedSvgUrl(parentElement);
        const context = canvas.getContext('2d');

        image.onload = () => {
            clearCanvas(canvas);
            context.drawImage(image, 0, 0);

            callback();
        };

        image.onerror = () => {
            throw new Error('Could not load image!');
        };

        image.src = svgUrl;
    };

    const drawSvgToCanvasAsync = (getCachedSvgUrl, canvas, parentElement) => {
        return new Promise(drawSvgToCanvas.bind(null, getCachedSvgUrl, canvas, parentElement));
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

    return {
        drawSvgToCanvas,
        drawSvgToCanvasAsync,
        drawWhereYouAtWindow
    };
};

export {
    canvasHelpersFactory
};
