import {getDifferenceKey} from './get-difference-key';
import {deepObjectDifference} from './deep-object-difference';

describe('GetDifferenceKey Tests', () => {
    it('get key from value change', () => {
        expect(getDifferenceKey(deepObjectDifference({Hello: 'World'}, {Hello: 'World!'}))).toStrictEqual([
            'Hello'
        ]);
    });

    it('get key from object change', () => {
        expect(getDifferenceKey(deepObjectDifference({
            Hello: 'World',
            This: {
                is: 'a nice Day!',
            }
        }, {
            Hello: 'World',
            This: {
                is: 'not a nice Day!',
            }
        }))).toStrictEqual([
            'This',
            'This.is'
        ]);
    });

    it('get key from array change', () => {
        expect(getDifferenceKey(deepObjectDifference({
            Hello: 'World',
            This: {
                is: 'a nice Day',
            },
            Numbers: [1, 2, 3, 4]
        }, {
            Hello: 'World',
            This: {
                is: 'a nice Day',
            },
            Numbers: [1, 8, 3, 4]
        }))).toStrictEqual(['Numbers']);
    });

    it('get key from multiple changes', () => {
        expect(getDifferenceKey(deepObjectDifference({
            Hello: 'World',
            This: {
                is: 'a nice Day',
            },
            Numbers: [1, 2, 3, 4]
        }, {
            Hello: 'World',
            This: {
                is: 'not a nice Day',
            },
            Numbers: [1, 8, 3, 4]
        }))).toStrictEqual([
            'This',
            'This.is',
            'Numbers'
        ]);
    });
});
