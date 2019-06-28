import {IMutationEvent, IOC_STORE} from './ioc-store.service';
import {filter} from 'rxjs/operators';

/**
 * mark the Function as an Event that happens after the State Mutation
 * @param type The name of the action that triggers this change.
 */
export function OnMutation(type: string | string[]) {
    const typeArr = typeof type === typeof [] ? type : <string[]> [type];
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        IOC_STORE.OnMutation
            .pipe(
                filter((eve: IMutationEvent) => typeArr.indexOf(eve.mutation.type) !== -1)
            ).subscribe((eve: IMutationEvent) => {
            descriptor.value.bind(eve.target)(eve.mutation);
        });
    };
}
