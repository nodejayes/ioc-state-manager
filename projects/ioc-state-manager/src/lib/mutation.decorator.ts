import {IMutation, IOC_STORE} from './ioc-store.service';

/**
 * mark the Function as a State mutation
 * @param type the Name of the Action that mutates the State
 */
export function Mutation(type: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function() {
            if (type.startsWith('___LIST_STATE_INTERNAL___')) {
                const key = type.replace('___LIST_STATE_INTERNAL___', '');
                type = this.constructor[key];
                if (!type) {
                    // no mutation definition in child class found
                    console.warn(`no mutation mapping found for ${key} in ${target.constructor.name} class define one as static string`);
                    return;
                }
            }
            const mutation: IMutation = {type};
            if (arguments[0]) {
                mutation.payload = arguments[0];
            }
            if (!target || !target.constructor) {
                throw new Error('Mutation Decorator not used in a StateService Class');
            }
            if (!this || !this.StateName) {
                throw new Error(`missing StateName implementation in ${target.constructor.name}`);
            }
            const state = IOC_STORE.GetState(this.StateName);

            if (arguments[0]) {
                method.bind(this)(mutation.payload, state, mutation.type);
            } else {
                method.bind(this)(state, mutation.type);
            }

            IOC_STORE.Mutate(this.StateName, state);
            IOC_STORE.OnMutation.emit({
                mutation,
                target: this
            });
            return;
        };
    };
}
