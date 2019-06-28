import { Injectable } from '@angular/core';

import { IocService, Mutation, OnMutation, IMutation } from '../../../../dist/ioc-state-manager';
import {ICounterState} from './counter-state.interface';
import {StateNames} from '../state-names.enum';
import {CounterMutation} from './counter.mutation';

@Injectable({
  providedIn: 'root'
})
export class CounterStateService extends IocService<ICounterState> {

  constructor() {
    super(StateNames.COUNTER, {
      counter: 0,
      min: 0,
      max: 10
    });
  }

  get Value() {
    return this.state().counter;
  }

  get MinValue() {
    return this.state().min;
  }

  get MaxValue() {
    return this.state().max;
  }

  onValueChange = this.listen<number>(s => s.counter);

  @Mutation(CounterMutation.INCREMENT)
  increment(payload: number, state?: ICounterState) {
    state.counter += payload;
  }

  @Mutation(CounterMutation.DECREMENT)
  decrement(payload: number, state?: ICounterState) {
    state.counter -= payload;
  }

  @OnMutation(CounterMutation.DECREMENT)
  private onDecrement(mutation: IMutation) {
    console.info('counter decrement by ', mutation.payload);
  }

  @OnMutation(CounterMutation.INCREMENT)
  private onIncrement(mutation: IMutation) {
    console.info('counter increment by ', mutation.payload);
  }
}
