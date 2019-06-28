import {isObject, isArray, keys, each} from 'lodash';

export const getDifferenceKey = (difference: any) => {
    const result: string[] = [];
    each(keys(difference), (key) => {
        if (isObject(difference[key]) && !isArray(difference[key])) {
            const availableKeys = getDifferenceKey(difference[key]);
            result[result.length] = key;
            for (const availableKey of availableKeys) {
                result[result.length] = key + '.' + availableKey;
            }
        } else {
            result.push(key);
        }
    });
    return result;
};
