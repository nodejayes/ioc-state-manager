import {Injectable} from '@angular/core';
import {IDetectable, IListState, ListStateService} from '../list-state.service';
import {OnMutation} from '../side-effects.decorator';
import {IMutation, IMutationEvent} from '../ioc-store.service';
import {find} from 'lodash';

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
    Update = '[test] update',
    UpdateSuccess = '[test] update success',
    UpdateFail = '[test] update fail',
    Delete = '[test] delete',
    DeleteSuccess = '[test] delete success',
    DeleteFail = '[test] delete fail',
}

@Injectable()
export class TestStateService extends ListStateService<ITestState, IUser> {
    static loadMutation = TestMutations.Load;
    static loadSuccessMutation = TestMutations.LoadSuccess;
    static loadFailMutation = TestMutations.LoadFail;
    static createMutation = TestMutations.Create;
    static createSuccessMutation = TestMutations.CreateSuccess;
    static createFailMutation = TestMutations.CreateFail;
    static updateMutation = TestMutations.Update;
    static updateSuccessMutation = TestMutations.UpdateSuccess;
    static updateFailMutation = TestMutations.UpdateFail;
    static deleteMutation = TestMutations.Delete;
    static deleteSuccessMutation = TestMutations.DeleteSuccess;
    static deleteFailMutation = TestMutations.DeleteFail;

    constructor() {
        super(TestStateNames.TEST, {
            data: [],
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
        }, 250);
    }

    @OnMutation(TestMutations.Create)
    private onCreate(mutation: IMutation) {
        // simulate Server Request
        setTimeout(() => {
            this.createSuccess(mutation.payload);
        }, 250);
    }

    @OnMutation(TestMutations.Update)
    private onUpdate(m: IMutation) {
        const that = this;
        // simulate Server Request
        setTimeout(() => {
            const found = find(that.Data, d => d.id === m.payload[0].id);
            if (found) {
                found.name = m.payload[0].name;
                this.updateSuccess([found]);
            }
        }, 250);
    }

    @OnMutation(TestMutations.Delete)
    private onDelete(mutation: IMutation) {
        // simulate Server Request
        setTimeout(() => {
            this.deleteSuccess(mutation.payload);
        }, 250);
    }

    testErrorLoad() {
        this.loadFail('error_message');
    }
}
