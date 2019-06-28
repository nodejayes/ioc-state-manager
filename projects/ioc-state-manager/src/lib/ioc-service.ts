import {IOC_STORE} from './ioc-store.service';

/**
 * represent an Service that can interact with the Store
 */
export class IocService<T> {
    readonly myName: string;

    get StateName(): string {
        return this.myName;
    }

    /**
     * register the State in the Store
     * @param stateName the Name of the State Key as string
     * @param defaultState the Default State Object (was set on Registration)
     */
    constructor(stateName: string, defaultState: T) {
        this.myName = stateName;
        IOC_STORE.RegisterState<T>(this.myName, defaultState);
    }

    /**
     * get a Copy of the Current State Object
     */
    protected state(): T {
        return IOC_STORE.GetState(this.myName);
    }

    /**
     * get an Listener for a State Property that fires when the State Property changes
     * @param selector the Selector Function to select a Property
     */
    protected listen<K>(selector: (state: T) => K) {
        const k = selector.toString()
            .split('{')[1]
            .split('}')[0]
            .trim()
            .split('return ').join('')
            .split(';').join('')
            .split('.');
        k[0] = this.myName;
        const key = k.join('.');
        return IOC_STORE.Listen<T, K>(key, selector);
    }
}
