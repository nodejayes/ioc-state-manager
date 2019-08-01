import {Injectable} from '@angular/core';
import {IDetectable, IListState, ListStateService} from '../list-state.service';

export enum TestStateNames {
    TEST = 'test',
}

export interface IUser extends IDetectable {
    id: number;
    name: string;
}

export interface ITestState extends IListState<IUser> {
    version: number;
}

export enum TestMutations {
    Load = '[test] load',
}

@Injectable()
export class TestStateService extends ListStateService<ITestState, IUser> {
    static loadMutation = TestMutations.Load;

    constructor() {
        super(TestStateNames.TEST, {
            data: null,
            loading: false,
            loaded: false,
            error_msg: null,
            version: 0,
        });
    }
}
