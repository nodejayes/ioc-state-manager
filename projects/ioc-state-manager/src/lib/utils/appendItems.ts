import {IDetectable} from '../list-state.service';
import {replaceItems} from './replace-items';
import {find} from 'lodash';

export function appendItems<T extends IDetectable>(source: T[], replacer: T[]): T[] {
    const tmpList = replaceItems<T>(source, replacer);
    for (const p of replacer) {
        if (!find(tmpList, e => e.id === p.id)) {
            tmpList.push(p);
        }
    }
    return tmpList;
}
