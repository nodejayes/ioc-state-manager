import {EventEmitter} from '@angular/core';
import {get, cloneDeep} from 'lodash';
import {getDifferenceKey} from './utils/get-difference-key';
import {deepObjectDifference} from './utils/deep-object-difference';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import {startWith} from 'rxjs/operators';

export interface IMutation {
    type: string;
    payload?: any;
}

export interface IMutationEvent {
    mutation: IMutation;
    target: any;
}

class IocStoreService {
    /**
     * the current Store Object
     */
    private store = {};

    public OnMutation = new EventEmitter<IMutationEvent>();
    private listener: { [key: string]: Subject<any> } = {};
    private selectors: { [key: string]: (state: any) => any } = {};

    public Listen<T, K>(key: string, selector: (state: T) => any): Observable<K> {
        let obs = null;
        if (!this.listener[key]) {
            this.listener[key] = new Subject<K>();
            obs = this.listener[key].asObservable().pipe(
                startWith(get(this.store, key))
            );
        }
        if (!this.selectors[key]) {
            this.selectors[key] = selector;
        }
        return obs;
    }

    /**
     * trigger a Listener with new State Data
     */
    private _fireListener(key: string, state: any): void {
        const emitter = this.listener[key];
        const selector = this.selectors[key];
        if (!emitter || !selector) {
            return;
        }
        const value = selector(state);
        emitter.next(value);
    }

    /**
     * read the Different States in the Store and handle the Listeners
     */
    private _handleListeners(name: string, oldState: any, newState: any): void {
        const diffs = getDifferenceKey(deepObjectDifference(newState || {}, oldState || {}));
        for (const key of diffs) {
            this._fireListener(name + '.' + key, newState);
        }
    }

    /**
     * get a copy of the current State
     */
    public GetState(name: string): any {
        return cloneDeep(this.store[name]);
    }

    /**
     * change the current State in the Store
     */
    public RegisterState<T>(name: string, newState: T): void {
        // not overwrite exist states so throw a runtime Error
        if (this.store.hasOwnProperty(name)) {
            throw new Error(`state ${name} already exists`);
        }
        this._mutateState(name, newState);
    }

    /**
     * mutate the current State
     */
    public Mutate<T>(name: string, newState: T): void {
        this._mutateState(name, newState);
    }

    /**
     * make a mutation of the current State
     */
    private _mutateState<T>(name: string, newState: T): void {
        this._handleListeners(name, this.store[name], newState);
        this._copyStore();
        this.store[name] = newState;
    }

    /**
     * create a new ObjectId of the current Store Object
     */
    private _copyStore(): void {
        this.store = {
            ...this.store,
        };
    }
}

export const IOC_STORE = new IocStoreService();
