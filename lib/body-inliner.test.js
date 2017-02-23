import {
    bodyInlinerFactory
} from './body-inliner';

describe('body-inliner module', () => {
    const mockParentElement         = jasmine.createSpyObj('mockParentElement', ['createObjectURL', 'cloneNode', 'appendChild', 'remove']);
    const mockWindow                = jasmine.createSpyObj('mockWindow', ['createObjectURL']);
    const mockGetBlob               = jasmine.createSpy('mockGetBlob');
    const mockInlineElementStyle    = jasmine.createSpy('mockInlineElementStyle');
    const mockGetElementClone       = jasmine.createSpy('mockGetElementClone');
    const mockObjectUrl = 'mockObjectUrl';
    const mockConvertNodeListToArray = 'mockConvertNodeListToArray';

    mockParentElement.style = {};
    mockParentElement.outerHTML = '<body>notInlinedHTML</body>';
    mockParentElement.createObjectURL.and.returnValue(mockObjectUrl);
    mockGetElementClone.and.callFake(element => element);
    mockInlineElementStyle.and.callFake((mockConvertNodeListToArray, mockWindow, element) => {
        element.outerHTML = '<body>inlinedHTML</body>';

        return element;
    });

    const initSUT = () => bodyInlinerFactory(mockInlineElementStyle, mockGetElementClone);

    describe('getCachedSvgUrl()', () => {
        const svgContainer = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">{{html}}</div></foreignObject></svg>';
        const fillSvgContainer = (content) => svgContainer.replace('{{html}}', content);
        const callMethod = () => {
            return initSUT().getCachedSvgUrl(mockConvertNodeListToArray, mockParentElement, mockWindow, mockGetBlob);
        };

        it('should be defined', () => {
            expect(initSUT().getCachedSvgUrl).toEqual(jasmine.any(Function));
        });

        it('should call getBlob', () => {
            const inlinedHTML = '<div>inlinedHTML</div>';

            callMethod();

            expect(mockGetBlob).toHaveBeenCalledWith([fillSvgContainer(inlinedHTML)], { type: 'image/svg+xml' });
        });
    });
});
