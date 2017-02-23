import {
    bodyInlinerFactory
} from './body-inliner';

describe('body-inliner module', () => {
    const mockParentElement         = jasmine.createSpyObj('mockParentElement', ['cloneNode', 'appendChild', 'remove']);
    const mockWindow                = jasmine.createSpyObj('mockWindow', ['createObjectURL']);
    const mockGetBlob               = jasmine.createSpy('mockGetBlob');
    const mockInlineElementStyle    = jasmine.createSpy('mockInlineElementStyle');
    const mockGetElementClone       = jasmine.createSpy('mockGetElementClone');
    const mockObjectUrl = 'mockObjectUrl';
    const mockSvgBlob = 'mockSvgBlob';

    mockParentElement.style = {};
    mockParentElement.outerHTML = '<body>notInlinedHTML</body>';
    mockParentElement.innerHTML = 'notInlinedHTML';
    mockGetElementClone.and.callFake(element => element);
    mockInlineElementStyle.and.callFake(element => {
        element.outerHTML = '<body>inlinedHTML</body>';

        return element;
    });
    mockWindow.createObjectURL.and.returnValue(mockObjectUrl);
    mockGetBlob.and.returnValue(mockSvgBlob);

    const initSUT = () => bodyInlinerFactory(mockInlineElementStyle, mockGetElementClone, mockGetBlob, mockWindow);

    describe('getCachedSvgUrl()', () => {
        const svgContainer = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">{{html}}</div></foreignObject></svg>';
        const fillSvgContainer = (content) => svgContainer.replace('{{html}}', content);
        const callMethod = () => {
            const SUT = initSUT();

            SUT.getCachedSvgUrl(mockParentElement);

            return SUT;
        };

        it('should be defined', () => {
            expect(initSUT().getCachedSvgUrl).toEqual(jasmine.any(Function));
        });

        it('should call getBlob', () => {
            const inlinedHTML = '<div>inlinedHTML</div>';

            callMethod();

            expect(mockGetBlob).toHaveBeenCalledWith([fillSvgContainer(inlinedHTML)], { type: 'image/svg+xml' });
        });

        it('should call createObjectURL', () => {
            mockWindow.createObjectURL.calls.reset();

            callMethod();

            expect(mockWindow.createObjectURL).toHaveBeenCalledWith(mockSvgBlob);
        });

        it('should remove clone', () => {
            mockParentElement.remove.calls.reset();

            callMethod();

            expect(mockParentElement.remove).toHaveBeenCalled();
        });

        it('should cache the result', () => {
            mockInlineElementStyle.calls.reset();

            const SUT = callMethod();

            expect(mockInlineElementStyle).toHaveBeenCalled();

            mockInlineElementStyle.calls.reset();

            SUT.getCachedSvgUrl(mockParentElement);

            expect(mockInlineElementStyle).not.toHaveBeenCalled();
        });
    });
});
