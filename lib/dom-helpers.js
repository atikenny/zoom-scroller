const domHelpersFactory = (convertNodeListToArray, window, document) => {
    const addStyleToElement = (element, styles) => {
        Object.keys(styles).forEach(propertyName => {
            element.style[propertyName] = styles[propertyName];
        });
    };

    const appendElement = (parentElement, tagName, elementStyles) => {
        const childElement = document.createElement(tagName);

        if (elementStyles) {
            addStyleToElement(childElement, elementStyles);
        }

        parentElement.appendChild(childElement);

        return childElement;
    };

    const fadeInElement = (element) => {
        addStyleToElement(element, {
            visibility: 'visible',
            opacity: 1
        });
    };

    const visualStyleProperties = ['background-color', 'color', 'margin', 'padding'];
    const notVisualTags = ['script', 'iframe', 'style'];
    const isNotVisualTag = (tagName) => notVisualTags.indexOf(tagName.toLowerCase()) !== -1;

    const inlineElementStyles = (element) => {
        if (isNotVisualTag(element.tagName)) {
            return;
        }

        const computedStyle = window.getComputedStyle(element);

        const elementVisualStyleProperties = visualStyleProperties.map(propertyName => {
            const propertyValue = computedStyle.getPropertyValue(propertyName);

            return `${propertyName}:${propertyValue}`;
        });

        element.style.cssText = elementVisualStyleProperties.join(';');

        convertNodeListToArray(element.children).forEach(inlineElementStyles);
    };

    const getElementClone = (element) => {
        const isDeepClone = true;

        return element.cloneNode(isDeepClone);
    };

    return {
        addStyleToElement,
        appendElement,
        fadeInElement,
        inlineElementStyles,
        getElementClone
    };
};

export {
    domHelpersFactory
};
