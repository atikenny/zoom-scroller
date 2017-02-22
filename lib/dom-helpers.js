const addStyleToElement = (element, styles) => {
    Object.keys(styles).forEach(propertyName => {
        element.style[propertyName] = styles[propertyName];
    });
};

const appendElement = (document, parentElement, tagName, elementStyles) => {
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

export {
    addStyleToElement,
    appendElement,
    fadeInElement
};
