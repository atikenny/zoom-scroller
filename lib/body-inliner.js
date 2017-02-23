const bodyInlinerFactory = (inlineElementStyles, getElementClone, getBlob, window) => {
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

    const getHTML = (parentElement) => {
        const parentClone = getElementClone(parentElement);

        appendClone(parentClone, parentElement);    // we need to append the clone for styles to take effect
        inlineElementStyles(parentClone);           // inline styles so the scroller gets them as well

        const fullPageHTML = replaceBodyWithDiv(parentClone);

        parentClone.remove();

        return fullPageHTML;
    };

    const addHTMLToSvg = (inlinedHTML) => {
        const svgContainer = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">{{html}}</div></foreignObject></svg>';

        return svgContainer.replace('{{html}}', inlinedHTML);
    };

    const getSvgUrl = (domUrl, parentElement) => {
        const inlinedHTML = getHTML(parentElement);
        
        const svg = getBlob([addHTMLToSvg(inlinedHTML)], { type: 'image/svg+xml' });

        return domUrl.createObjectURL(svg);
    };

    const getCachedSvgUrl = (parentElement) => {
        const domUrl = window.URL || window.webkitURL || window;

        let cachedValue = cache[parentElement.innerHTML];
        
        if (cachedValue) {
            return cachedValue;
        }

        const svgUrl = getSvgUrl(domUrl, parentElement);

        cache[parentElement.innerHTML] = svgUrl;

        return svgUrl;
    };

    return {
        getCachedSvgUrl
    };
};

export {
    bodyInlinerFactory
};
