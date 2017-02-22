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

export default bodyInliner;
