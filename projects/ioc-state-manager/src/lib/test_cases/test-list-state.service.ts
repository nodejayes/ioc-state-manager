import {Injectable} from '@angular/core';
import {IDetectable, IListState, ListStateService} from '../list-state.service';
import {OnMutation} from '../side-effects.decorator';
import {IMutation} from '../ioc-store.service';

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
    LoadSuccess = '[test] load success',
    LoadFail = '[test] load fail',
    Create = '[test] create',
    CreateSuccess = '[test] create success',
    CreateFail = '[test] create fail',
}

@Injectable()
export class TestStateService extends ListStateService<ITestState, IUser> {
    static loadMutation = TestMutations.Load;
    static loadSuccessMutation = TestMutations.LoadSuccess;
    static loadFailMutation = TestMutations.LoadFail;
    static createMutation = TestMutations.Create;
    static createSuccessMutation = TestMutations.CreateSuccess;
    static createFailMutation = TestMutations.CreateFail;

    constructor() {
        super(TestStateNames.TEST, {
            data: null,
            loading: false,
            loaded: false,
            error_msg: null,
            version: 0,
        });
    }

    @OnMutation(TestMutations.Load)
    private onLoad() {
        // simulate Server Request
        setTimeout(() => {
            this.loadSuccess([
                {id: 1, name: 'Udo'},
                {id: 2, name: 'Paul'},
                {id: 3, name: 'Martina'},
            ]);
        }, 1000);
    }

    @OnMutation(TestMutations.Create)
    private onCreate(mutation: IMutation) {
        // simulate Server Request
        setTimeout(() => {
            this.createSuccess(mutation.payload);
        }, 1000);
    }

    testErrorLoad() {
        this.loadFail('error_message');
    }
}
