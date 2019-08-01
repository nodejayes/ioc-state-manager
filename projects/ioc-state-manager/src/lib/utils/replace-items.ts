import {IDetectable} from '../list-state.service';

export function replaceItems<T extends IDetectable>(source: T[], replacer: T[]): T[] {
    const tmpList = [];
    for (const d of source) {
        for (const p of replacer) {
            if (p.id === d.id) {
                tmpList.push(p);
            } else {
                tmpList.push(d);
            }
        }
    }
    return tmpList;
}
