import {
    getCachedSvgUrl
} from './body-inliner';

describe('body-inliners module', () => {
    describe('getCachedSvgUrl()', () => {
        it('should be defined', () => {
            expect(getCachedSvgUrl).toEqual(jasmine.any(Function));
        });
    });
});
