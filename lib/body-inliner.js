const bodyInliner = (() => {
    const getParentClone = (parentElement) => {
        const isDeepClone = true;

        return parentElement.cloneNode(isDeepClone);
    };

    const appendClone = (parentClone) => {
        parentClone.style.display = 'none';
        document.body.appendChild(parentClone);
    };

    const notVisualTags = ['script', 'iframe', 'style'];
    const isNotVisualTag = (tagName) => notVisualTags.indexOf(tagName.toLowerCase()) !== -1;

    const visualStyleProperties = ['background-color', 'color', 'margin', 'padding'];

    const inlineStyles = (window, element) => {
        if (isNotVisualTag(element.tagName)) {
            return;
        }

        const computedStyle = window.getComputedStyle(element);

        const elementVisualStyleProperties = visualStyleProperties.map(propertyName => {
            const propertyValue = computedStyle.getPropertyValue(propertyName);

            return `${propertyName}:${propertyValue}`;
        });

        element.style.cssText = elementVisualStyleProperties.join(';');

        Array.from(element.children).forEach(inlineStyles.bind(null, window));
    };

    const replaceBodyWithDiv = (parentClone) => {
        return parentClone.outerHTML
            .replace('<body', '<div')
            .replace('</body', '</div');
    };

    const getHTML = (parentElement, window) => {
        const parentClone = getParentClone(parentElement);
        const boundInlineStyles = inlineStyles.bind(null, window);

        appendClone(parentClone);           // we need to append the clone for styles to take effect
        boundInlineStyles(parentClone);     // inline styles so the scroller gets them as well

        const fullPageHTML = replaceBodyWithDiv(parentClone);

        parentClone.remove();

        return fullPageHTML;
    };

    return {
        getHTML
    };
})();

const addHTMLToSvg = (inlinedHTML) => {
    const data = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">{{html}}</div></foreignObject></svg>';

    return data.replace('{{html}}', inlinedHTML);
};

const getSvgUrl = (domUrl, parentElement, window) => {
    const inlinedHTML = bodyInliner.getHTML(parentElement, window);

    const svg = new Blob([addHTMLToSvg(inlinedHTML)], { type: 'image/svg+xml' });
    
    return domUrl.createObjectURL(svg);
};

const cache = {};
const getCachedSvgUrl = (parentElement, window) => {
    const domUrl = window.URL || window.webkitURL || window;

    let cachedValue = cache[domUrl];
    
    if (cachedValue) {
        return cachedValue;
    }

    const svgUrl = getSvgUrl(domUrl, parentElement, window);

    cache[domUrl] = svgUrl;

    return svgUrl;
};

export {
    getCachedSvgUrl
};
