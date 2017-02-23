import {
    drawSvgToCanvasAsync,
    drawWhereYouAtWindow
} from './canvas-helpers';

describe('canvas-helpers module', () => {
    describe('drawSvgToCanvasAsync()', () => {
        it('should be defined', () => {
            expect(drawSvgToCanvasAsync).toEqual(jasmine.any(Function));
        });
    });

    describe('drawWhereYouAtWindow()', () => {
        it('should be defined', () => {
            expect(drawWhereYouAtWindow).toEqual(jasmine.any(Function));
        });
    });
});
