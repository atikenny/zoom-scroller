import {
    drawSvgToCanvasAsync,
    drawWhereYouAtWindow
} from './lib/canvas-helpers';

import {
    addStyleToElement,
    appendElement,
    fadeInElement
} from './lib/dom-helpers';

(() => {
    'use strict';

    const config = {
        scrollerWidth: 100,
        blurScroller: true
    };

    let ticking = false;

    const appendCanvas = (parentElement, blurScroller) => {
        const canvasStyles = {
            position: 'fixed',
            top: 0,
            left: 0,
            transformOrigin: 'top right',
            cursor: 'pointer',
            transition: 'all .2s linear',
            visibility: 'hidden',
            opacity: 0,
            filter: blurScroller ? 'blur(4px)' : ''
        };

        return appendElement(parentElement, 'canvas', canvasStyles);
    };

    const scaleCanvas = (parentElement, canvas, scrollerWidth, isScrollEvent) => {
        const getScrollerScale = (targetWidth) => {
            const scale = 1 / (parentElement.scrollWidth / targetWidth);

            return scale;
        };

        const scrollerScale = getScrollerScale(scrollerWidth);

        canvas.width = parentElement.scrollWidth;
        canvas.height = parentElement.scrollHeight;

        addStyleToElement(canvas, { transform: `scale(${scrollerScale}, ${scrollerScale})` });
    };

    const attachScrollAndResizeEvents = (parentElement, window, canvas, scrollerWidth) => {
        const scaleCallback = (isScrollEvent) => {
            drawSvgToCanvasAsync(canvas, window, parentElement)
                .then(onEndDrawingSvg);

            if (!isScrollEvent) {
                scaleCanvas(parentElement, canvas, scrollerWidth);
            }
        };

        const eventHandler = (event) => {
            if (!ticking) {
                const isScrollEvent = event.type === 'scroll';

                window.requestAnimationFrame(scaleCallback.bind(null, isScrollEvent));
            }

            ticking = true;
        };

        window.addEventListener('resize', eventHandler);
        window.addEventListener('scroll', eventHandler);
    };

    const attachCanvasClickEvent = (parentElement, canvas) => {
        const eventHandler = (event) => {
            parentElement.scrollTop = event.offsetY - (parentElement.clientHeight / 2);
        };

        canvas.addEventListener('click', eventHandler);
        canvas.addEventListener('mousedown', () => {
            canvas.addEventListener('mousemove', eventHandler);
        });
        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', eventHandler);
        });
    };

    const parentElement = document.body;

    const canvas = appendCanvas(parentElement, config.blurScroller);

    const onEndDrawingSvg = () => {
        drawWhereYouAtWindow(parentElement, canvas);
        ticking = false;
    };

    drawSvgToCanvasAsync(canvas, window, parentElement)
        .then(onEndDrawingSvg);

    scaleCanvas(parentElement, canvas, config.scrollerWidth);
    fadeInElement(canvas);

    attachScrollAndResizeEvents(parentElement, window, canvas, config.scrollerWidth);
    attachCanvasClickEvent(parentElement, canvas);
})();