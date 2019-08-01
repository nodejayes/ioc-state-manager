import {IocService} from './ioc-service';
import {Mutation} from './mutation.decorator';
import {replaceItems} from './utils/replace-items';
import {removeItems} from './utils/remove-items';
import {appendItems} from './utils/appendItems';

export type IdValue = string | number;

export interface IDetectable {
    id: IdValue;
}

export interface ILoadableState {
    loading: boolean;
    loaded: boolean;
    error_msg: string;
}

export interface IListState<T> extends ILoadableState {
    data: T[];
}

export interface IObjectState<T> extends ILoadableState {
    data: T;
}

export class ListStateService<T extends IListState<K>, K extends IDetectable> extends IocService<T> {
    get Loading(): boolean {
        return super.state().loading;
    }

    get Loaded(): boolean {
        return super.state().loaded;
    }

    get Data(): K[] {
        return super.state().data;
    }

    get Error(): string {
        return super.state().error_msg;
    }

    loading$ = super.listen<boolean>(s => s.loading);
    loaded$ = super.listen<boolean>(s => s.loaded);
    data$ = super.listen<K[]>(s => s.data);
    error$ = super.listen<string>(s => s.error_msg);

    constructor(name: string, defaultState: T) {
        super(name, defaultState);
    }

    @Mutation('___LIST_STATE_INTERNAL___loadMutation')
    load(s?: T) {
        s.data = [];
        s.loaded = false;
        s.loading = true;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___loadSuccessMutation')
    loadSuccess(payload: K[], s?: T) {
        s.data = payload;
        s.loaded = true;
        s.loading = false;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___loadFailMutation')
    loadFail(error: string, s?: T) {
        s.data = [];
        s.loaded = false;
        s.loading = false;
        s.error_msg = error;
    }

    @Mutation('___LIST_STATE_INTERNAL___createMutation')
    create(payload: K[], s?: T) {
        s.data = [];
        s.loaded = false;
        s.loading = true;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___createSuccessMutation')
    createSuccess(payload: K[], s?: T) {
        s.data = appendItems(s.data, payload);
        s.loaded = true;
        s.loading = false;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___createFailMutation')
    createFail(error: string, s?: T) {
        s.loaded = false;
        s.loading = false;
        s.error_msg = error;
    }

    @Mutation('___LIST_STATE_INTERNAL___updateMutation')
    update(payload: any[], s?: T) {
        s.loaded = false;
        s.loading = true;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___updateSuccessMutation')
    updateSuccess(payload: K[], s?: T) {
        s.data = replaceItems<K>(s.data, payload);
        s.loaded = true;
        s.loading = false;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___updateFailMutation')
    updateFail(error: string, s?: T) {
        s.loaded = false;
        s.loading = false;
        s.error_msg = error;
    }

    @Mutation('___LIST_STATE_INTERNAL___deleteMutation')
    delete(payload: IdValue[], s?: T) {
        s.loaded = false;
        s.loading = true;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___deleteSuccessMutation')
    deleteSuccess(payload: IdValue[], s?: T) {
        s.data = removeItems<K>(s.data, payload);
        s.loaded = true;
        s.loading = false;
        s.error_msg = null;
    }

    @Mutation('___LIST_STATE_INTERNAL___deleteFailMutation')
    deleteFail(error: string, s?: T) {
        s.loaded = false;
        s.loading = false;
        s.error_msg = error;
    }
}
