import {IDetectable, IdValue} from '../list-state.service';
import {includes} from 'lodash';

export function removeItems<T extends IDetectable>(source: T[], deleteList: IdValue[]) {
    const tmpList = [];
    for (const s of source) {
        if (!includes(deleteList, s.id)) {
            tmpList.push(s);
        }
    }
    return tmpList;
}
