const bodyInlinerFactory = (inlineElementStyles, getElementClone) => {
    const cache = {};

    const appendClone = (parentClone, parentElement) => {
        parentClone.style.display = 'none';
        parentElement.appendChild(parentClone);
    };

    const replaceBodyWithDiv = (parentClone) => {
        return parentClone.outerHTML
            .replace('<body', '<div')
            .replace('</body', '</div');
    };

    const getHTML = (convertNodeListToArray, parentElement, window) => {
        const parentClone = getElementClone(parentElement);

        appendClone(parentClone, parentElement);                            // we need to append the clone for styles to take effect
        inlineElementStyles(convertNodeListToArray, window, parentClone);   // inline styles so the scroller gets them as well

        const fullPageHTML = replaceBodyWithDiv(parentClone);

        parentClone.remove();

        return fullPageHTML;
    };

    const addHTMLToSvg = (inlinedHTML) => {
        const svgContainer = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">{{html}}</div></foreignObject></svg>';

        return svgContainer.replace('{{html}}', inlinedHTML);
    };

    const getSvgUrl = (convertNodeListToArray, domUrl, parentElement, window, getBlob) => {
        const inlinedHTML = getHTML(convertNodeListToArray, parentElement, window);

        const svg = getBlob([addHTMLToSvg(inlinedHTML)], { type: 'image/svg+xml' });
        
        return domUrl.createObjectURL(svg);
    };

    const getCachedSvgUrl = (convertNodeListToArray, parentElement, window, getBlob) => {
        const domUrl = window.URL || window.webkitURL || window;

        let cachedValue = cache[domUrl];
        
        if (cachedValue) {
            return cachedValue;
        }

        const svgUrl = getSvgUrl(convertNodeListToArray, domUrl, parentElement, window, getBlob);

        cache[domUrl] = svgUrl;

        return svgUrl;
    };

    return {
        getCachedSvgUrl
    };
};

export {
    bodyInlinerFactory
};
