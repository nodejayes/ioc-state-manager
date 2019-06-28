import { Component }       from '@angular/core';
import {CounterStateService} from './store/counter/counter-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value$ = this.counterState.onValueChange;
  step = 1;

  constructor(private counterState: CounterStateService) {}

  increment() {
    const v = parseInt(this.step.toString(), 10);
    if (!isNaN(v)) {
      const newOne = this.counterState.Value + v;
      if (newOne <= this.counterState.MaxValue && newOne >= this.counterState.MinValue) {
        this.counterState.increment(v);
      }
    }
  }

  decrement() {
    const v = parseInt(this.step.toString(), 10);
    if (!isNaN(v)) {
      const newOne = this.counterState.Value - v;
      if (newOne <= this.counterState.MaxValue && newOne >= this.counterState.MinValue) {
        this.counterState.decrement(v);
      }
    }
  }
}
