import {transform, isEqual, isObject} from 'lodash';

export const deepObjectDifference = (object, base) => {
    const changes = (obj, b) => {
        return transform(obj, function(result, value, key) {
            if (!isEqual(value, b[key])) {
                result[key] = (isObject(value) && isObject(b[key])) ? changes(value, b[key]) : value;
            }
        });
    };
    return changes(object, base);
};
