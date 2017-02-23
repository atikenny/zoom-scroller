import {
    addStyleToElement,
    appendElement,
    fadeInElement,
    inlineElementStyles,
    getElementClone
} from './dom-helpers';

const mockElementStyles = {
    property1: 'property1',
    property2: 'property2',
    property3: 'property3',
    property4: 'property4'
};

describe('dom-helpers module', () => {
    describe('addStyleToElement()', () => {
        it('should be defined', () => {
            expect(addStyleToElement).toEqual(jasmine.any(Function));
        });

        it('should add styles to an element', () => {
            let targetElement = {
                style: {}
            };

            addStyleToElement(targetElement, mockElementStyles);

            checkElementStyles(targetElement, mockElementStyles);
        });
    });

    describe('appendElement()', () => {
        it('should be defined', () => {
            expect(appendElement).toEqual(jasmine.any(Function));
        });

        it('should append child element after applying styles', () => {
            // GIVEN
            const mockParentElement = {
                appendChild: jasmine.createSpy('appendChild')
            };
            const mockElementStyles = {};
            const documentSpy = jasmine.createSpyObj('document', ['createElement']);

            documentSpy.createElement.and.returnValue({
                style: {}
            });

            // WHEN
            const appendedElement = appendElement(documentSpy, mockParentElement, 'tagName', mockElementStyles);

            // THEN
            expect(documentSpy.createElement).toHaveBeenCalledWith('tagName');
            expect(mockParentElement.appendChild).toHaveBeenCalledWith(appendedElement);
            checkElementStyles(appendedElement, mockElementStyles);
        });
    });

    describe('fadeInElement()', () => {
        it('should be defined', () => {
            expect(fadeInElement).toEqual(jasmine.any(Function));
        });

        it('should add visibility and opacity styles', () => {
            let targetElement = {
                style: {}
            };

            fadeInElement(targetElement);

            expect(targetElement.style.visibility).toEqual('visible');
            expect(targetElement.style.opacity).toEqual(1);
        });
    });

    describe('inlineElementStyles()', () => {
        const mockWindow = jasmine.createSpyObj('mockWindow', ['getComputedStyle']);
        const mockElementChild1 = {
            tagName: '',
            style: {},
            children: []
        };
        const mockElementChild2 = {
            tagName: '',
            style: {},
            children: []
        };
        const mockElement = {
            tagName: '',
            style: {},
            children: [mockElementChild1, mockElementChild2]
        };
        const mockConvertNodeListToArray = (nodeList) => nodeList;
        const mockStyles = {
            'background-color': 'background-color',
            'color': 'color',
            'margin': 'margin',
            'padding': 'padding',
            'dont-care': 'dont-care'
        };
        const expectedCssText = Object.keys(mockStyles)
            .filter(propertyName => propertyName !== 'dont-care')
            .map(propertyName => `${propertyName}:${mockStyles[propertyName]}`)
            .join(';');

        mockWindow.getComputedStyle.and.returnValue({
            getPropertyValue: (propertyName) => mockStyles[propertyName]
        });

        it('should add cssText to element', () => {
            inlineElementStyles(mockConvertNodeListToArray, mockWindow, mockElement);

            expect(mockElement.style.cssText).toEqual(expectedCssText);
            expect(mockElement.children[0].style.cssText).toEqual(expectedCssText);
            expect(mockElement.children[1].style.cssText).toEqual(expectedCssText);
        });
    });

    describe('getElementClone()', () => {
        it('should call cloneNode on element', () => {
            const mockElement = jasmine.createSpyObj('mockElement', ['cloneNode']);

            getElementClone(mockElement);

            expect(mockElement.cloneNode).toHaveBeenCalledWith(true);
        });
    });
});

const checkElementStyles = (element, styles) => {
    Object.keys(styles).forEach(propertyName => {
        expect(element.style[propertyName]).toEqual(styles[propertyName]);
    });
};
