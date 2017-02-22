(() => {
    'use strict';

    const config = {
        scrollerWidth: 100,
        blurScroller: true
    };

    let ticking = false;
    const hasRequestAnimationFrame = !!window.requestAnimationFrame;

    const bodyInliner = (() => {
        const getBodyClone = () => {
            const bodyNode = document.getElementsByTagName('body')[0];
            const isDeepClone = true;

            return bodyNode.cloneNode(isDeepClone);
        };

        const appendClone = (bodyClone) => {
            bodyClone.style.display = 'none';
            document.body.appendChild(bodyClone);
        };

        const notVisualTags = ['script', 'iframe', 'style'];
        const isNotVisualTag = (tagName) => notVisualTags.indexOf(tagName.toLowerCase()) !== -1;

        const visualStyleProperties = ['background-color', 'color', 'margin', 'padding'];

        const inlineStyles = (element) => {
            if (isNotVisualTag(element.tagName)) {
                return;
            }

            const computedStyle = window.getComputedStyle(element);

            const elementVisualStyleProperties = visualStyleProperties.map(propertyName => {
                const propertyValue = computedStyle.getPropertyValue(propertyName);

                return `${propertyName}:${propertyValue}`;
            });

            element.style.cssText = elementVisualStyleProperties.join(';');

            Array.from(element.children).forEach(inlineStyles);
        };

        const replaceBodyWithDiv = (bodyClone) => {
            return bodyClone.outerHTML
                .replace('<body', '<div')
                .replace('</body', '</div');
        };

        const getHTML = () => {
            const bodyClone = getBodyClone();

            appendClone(bodyClone);     // we need to append the clone for styles to take effect
            inlineStyles(bodyClone);    // inline styles so the scroller gets them as well

            const fullPageHTML = replaceBodyWithDiv(bodyClone);

            bodyClone.remove();

            return fullPageHTML;
        };

        return {
            getHTML
        };
    })();

    const appendCanvas = (blurScroller) => {
        const canvas = document.createElement('canvas');
        
        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.transformOrigin = 'top right';
        canvas.style.cursor = 'pointer';

        if (blurScroller) {
            canvas.style.filter = 'blur(4px)';
        }

        canvas.style.transition = 'all .2s linear';
        
        fadeOutElement(canvas);
        
        document.body.appendChild(canvas);

        return canvas;
    };

    const getSvgUrl = (domUrl, inlinedHTML) => {
        const getSVG = (inlinedHTML) => {
            const data = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">{{html}}</div></foreignObject></svg>';
            
            return data.replace('{{html}}', inlinedHTML);  
        };

        const svg = new Blob([getSVG(inlinedHTML)], { type: 'image/svg+xml' });
        
        return domUrl.createObjectURL(svg);
    };

    const createImageOnCanvas = (canvas, domUrl, svgUrl) => {
        const context = canvas.getContext('2d');
        const img = new Image();

        img.onload = (event) => {
            clearCanvas(canvas);
            context.drawImage(img, 0, 0);
            domUrl.revokeObjectURL(svgUrl);

            drawWhereYouAtWindow(context);

            ticking = false;
        };

        img.src = svgUrl;
    };

    const clearCanvas = (canvas) => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));
    };

    const scaleCanvas = (canvas, scrollerWidth, isScrollEvent) => {
        const getScrollerScale = (targetWidth) => {
            const scale = 1 / (document.body.scrollWidth / targetWidth);

            return scale;
        };

        const scrollerScale = getScrollerScale(scrollerWidth);

        canvas.setAttribute('width', document.body.scrollWidth);
        canvas.setAttribute('height', document.body.scrollHeight);

        canvas.style.transform = `scale(${scrollerScale}, ${scrollerScale})`;
    };

    const drawWhereYouAtWindow = (context) => {
        const rectStartY = document.body.scrollTop;
        const rectWidth = document.body.clientWidth;
        const rectHeight = document.body.clientHeight;

        context.globalCompositeOperation = 'darken';
        context.fillStyle = 'grey';
        context.fillRect(0, rectStartY, rectWidth, rectHeight);
    };

    const fadeOutElement = (element) => {
        element.style.visibility = 'hidden';
        element.style.opacity = 0;
    };

    const fadeInElement = (element) => {
        element.style.visibility = 'visible';
        element.style.opacity = 1;
    };

    const attachScrollAndResizeEvents = (element, canvas, domUrl, scrollerWidth, inlinedHTML) => {
        const scaleCallback = (isScrollEvent) => {
            createImageOnCanvas(canvas, domUrl, getSvgUrl(domUrl, inlinedHTML));

            if (!isScrollEvent) {
                scaleCanvas(canvas, scrollerWidth);
            }
        };

        const eventHandler = (event) => {
            if (!ticking) {
                const isScrollEvent = event.type === 'scroll';

                window.requestAnimationFrame(scaleCallback.bind(null, isScrollEvent));
            }

            ticking = true;
        };

        element.addEventListener('resize', eventHandler);
        element.addEventListener('scroll', eventHandler);
    };

    const attachCanvasClickEvent = (body, canvas) => {
        const eventHandler = (event) => {
            body.scrollTop = event.offsetY - (body.clientHeight / 2);
        };

        canvas.addEventListener('click', eventHandler);
        canvas.addEventListener('mousedown', () => {
            canvas.addEventListener('mousemove', eventHandler);
        });
        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', eventHandler);
        });
    };

    const domUrl = window.URL || window.webkitURL || window;

    const inlinedHTML = bodyInliner.getHTML();
    const canvas = appendCanvas(config.blurScroller);
    const svgUrl = getSvgUrl(domUrl, inlinedHTML);

    createImageOnCanvas(canvas, domUrl, svgUrl);
    scaleCanvas(canvas, config.scrollerWidth);
    fadeInElement(canvas);

    attachScrollAndResizeEvents(window, canvas, domUrl, config.scrollerWidth, inlinedHTML);
    attachCanvasClickEvent(document.body, canvas);
})();