import {
    drawSvgToCanvas,
    drawSvgToCanvasAsync,
    drawWhereYouAtWindow
} from './canvas-helpers';

describe('canvas-helpers module', () => {
    const mockCanvas = jasmine.createSpyObj('mockCanvas', ['getContext']);
    const mockCanvasWidth = 'mockCanvasWidth';
    const mockCanvasHeight = 'mockCanvasHeight';
    const mockContext = {
        fillRect: jasmine.createSpy('fillRect'),
        drawImage: jasmine.createSpy('drawImage'),
        clearRect: jasmine.createSpy('clearRect')
    };
    const mockWindow = 'mockWindow';
    const mockImage = {};
    const mockGetBlob = 'mockGetBlob';
    const mockCachedSvgUrl = 'mockCachedSvgUrl';
    const mockConvertNodeListToArray = 'mockConvertNodeListToArray';
    const mockGetCachedSvgUrl = jasmine.createSpy('mockGetCachedSvgUrl');
    const mockCallback = jasmine.createSpy('mockCallback');
    const mockParentElement = {
        scrollTop: 'scrollTop',
        clientWidth: 'clientWidth',
        clientHeight: 'clientHeight',
    };

    mockGetCachedSvgUrl.and.returnValue(mockCachedSvgUrl);
    mockCanvas.width = mockCanvasWidth;
    mockCanvas.height = mockCanvasHeight;
    mockCanvas.getContext.and.returnValue(mockContext);

    describe('drawSvgToCanvasAsync()', () => {
        it('should be defined', () => {
            expect(drawSvgToCanvasAsync).toEqual(jasmine.any(Function));
        });

        it('should return a promise', () => {
            expect(drawSvgToCanvasAsync(mockConvertNodeListToArray, mockGetCachedSvgUrl, mockCanvas, mockImage, mockWindow, mockGetBlob, mockParentElement)).toEqual(jasmine.any(Promise));
        });
    });

    describe('drawSvgToCanvas()', () => {
        const callMethod = () => {
            drawSvgToCanvas(mockConvertNodeListToArray, mockGetCachedSvgUrl, mockCanvas, mockImage, mockWindow, mockGetBlob, mockParentElement, mockCallback);
        };

        it('should call getCachedSvgUrl', () => {
            callMethod();

            expect(mockGetCachedSvgUrl).toHaveBeenCalledWith(mockConvertNodeListToArray, mockParentElement, mockWindow, mockGetBlob);
        });

        it('should set src of the image', () => {
            callMethod();

            expect(mockImage.src).toEqual(mockCachedSvgUrl);
        });

        it('should set onload method', () => {
            callMethod();

            // WHEN
            mockImage.onload();

            // THEN
            expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, mockCanvasWidth, mockCanvasHeight);
            expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, 0, 0);
            expect(mockCallback).toHaveBeenCalled();
        });

        it('should set onerror method', () => {
            callMethod();

            expect(mockImage.onerror).toThrow(new Error('Could not load image!'));
        });
    });

    describe('drawWhereYouAtWindow()', () => {
        it('should be defined', () => {
            expect(drawWhereYouAtWindow).toEqual(jasmine.any(Function));
        });

        it('should draw window on the provided canvas', () => {
            // WHEN
            drawWhereYouAtWindow(mockParentElement, mockCanvas);

            // THEN
            expect(mockContext.globalCompositeOperation).toEqual('darken');
            expect(mockContext.fillStyle).toEqual('grey');
            expect(mockContext.fillRect).toHaveBeenCalledWith(
                0,
                mockParentElement.scrollTop,
                mockParentElement.clientWidth,
                mockParentElement.clientHeight
            );
        });
    });
});
