import {
    domHelpersFactory
} from './dom-helpers';

const mockElementStyles = {
    property1: 'property1',
    property2: 'property2',
    property3: 'property3',
    property4: 'property4'
};

const mockStylesToInline = {
    'background-color': 'background-color',
    'color': 'color',
    'margin': 'margin',
    'padding': 'padding',
    'dont-care': 'dont-care'
};

describe('dom-helpers module', () => {
    const mockConvertNodeListToArray = (nodeList) => nodeList;
    const mockWindow = jasmine.createSpyObj('mockWindow', ['getComputedStyle']);
    const mockDocument = jasmine.createSpyObj('document', ['createElement']);

    mockWindow.getComputedStyle.and.returnValue({
        getPropertyValue: (propertyName) => mockStylesToInline[propertyName]
    });
    mockDocument.createElement.and.returnValue({
        style: {}
    });

    const initSUT = () => domHelpersFactory(mockConvertNodeListToArray, mockWindow, mockDocument);

    describe('addStyleToElement()', () => {
        it('should be defined', () => {
            expect(initSUT().addStyleToElement).toEqual(jasmine.any(Function));
        });

        it('should add styles to an element', () => {
            let targetElement = {
                style: {}
            };

            initSUT().addStyleToElement(targetElement, mockElementStyles);

            checkElementStyles(targetElement, mockElementStyles);
        });
    });

    describe('appendElement()', () => {
        it('should be defined', () => {
            expect(initSUT().appendElement).toEqual(jasmine.any(Function));
        });

        it('should append child element after applying styles', () => {
            // GIVEN
            const mockParentElement = {
                appendChild: jasmine.createSpy('appendChild')
            };
            const mockElementStyles = {};

            // WHEN
            const appendedElement = initSUT().appendElement(mockParentElement, 'tagName', mockElementStyles);

            // THEN
            expect(mockDocument.createElement).toHaveBeenCalledWith('tagName');
            expect(mockParentElement.appendChild).toHaveBeenCalledWith(appendedElement);
            checkElementStyles(appendedElement, mockElementStyles);
        });
    });

    describe('fadeInElement()', () => {
        it('should be defined', () => {
            expect(initSUT().fadeInElement).toEqual(jasmine.any(Function));
        });

        it('should add visibility and opacity styles', () => {
            let targetElement = {
                style: {}
            };

            initSUT().fadeInElement(targetElement);

            expect(targetElement.style.visibility).toEqual('visible');
            expect(targetElement.style.opacity).toEqual(1);
        });
    });

    describe('inlineElementStyles()', () => {
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
        const expectedCssText = Object.keys(mockStylesToInline)
            .filter(propertyName => propertyName !== 'dont-care')
            .map(propertyName => `${propertyName}:${mockStylesToInline[propertyName]}`)
            .join(';');

        it('should add cssText to element', () => {
            initSUT().inlineElementStyles(mockElement);

            expect(mockElement.style.cssText).toEqual(expectedCssText);
            expect(mockElement.children[0].style.cssText).toEqual(expectedCssText);
            expect(mockElement.children[1].style.cssText).toEqual(expectedCssText);
        });
    });

    describe('getElementClone()', () => {
        it('should call cloneNode on element', () => {
            const mockElement = jasmine.createSpyObj('mockElement', ['cloneNode']);

            initSUT().getElementClone(mockElement);

            expect(mockElement.cloneNode).toHaveBeenCalledWith(true);
        });
    });
});

const checkElementStyles = (element, styles) => {
    Object.keys(styles).forEach(propertyName => {
        expect(element.style[propertyName]).toEqual(styles[propertyName]);
    });
};
