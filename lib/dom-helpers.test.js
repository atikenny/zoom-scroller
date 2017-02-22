import {
    addStyleToElement,
    appendElement,
    fadeInElement
} from './dom-helpers';

const mockElementStyles = {
    property1: 'property1',
    property2: 'property2',
    property3: 'property3',
    property4: 'property4'
};

describe('dom-helpers', () => {
    describe('addStyleToElement()', () => {
        it('should add styles to an element', () => {
            let targetElement = {
                style: {}
            };

            addStyleToElement(targetElement, mockElementStyles);

            checkElementStyles(targetElement, mockElementStyles);
        });
    });

    describe('appendElement()', () => {
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
        it('should add visibility and opacity styles', () => {
            let targetElement = {
                style: {}
            };

            fadeInElement(targetElement);

            expect(targetElement.style.visibility).toEqual('visible');
            expect(targetElement.style.opacity).toEqual(1);
        });
    }); 
});

const checkElementStyles = (element, styles) => {
    Object.keys(styles).forEach(propertyName => {
        expect(element.style[propertyName]).toEqual(styles[propertyName]);
    });
};
