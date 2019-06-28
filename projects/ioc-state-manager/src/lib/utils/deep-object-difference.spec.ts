import {deepObjectDifference} from './deep-object-difference';

describe('DeepObjectDifference Tests', () => {
    it('same object returns empty object', () => {
        expect(deepObjectDifference({Hello: 'World'}, {Hello: 'World'})).toStrictEqual({});
    });

    it('return only differences', () => {
        expect(deepObjectDifference({
            Hello: 'World',
            This: {
                is: 'a nice Day!',
            }
        }, {
            Hello: 'World',
            This: {
                is: 'not a nice Day!',
            }
        })).toStrictEqual({
            This: {
                is: 'a nice Day!',
            }
        });
    });
});
