import {TestMutations, TestStateService} from './test_cases/test-list-state.service';
import {TestBed} from '@angular/core/testing';

describe('ListStateService', () => {
    let service: TestStateService = null;
    beforeAll(() => {
        TestBed.configureTestingModule({
            providers: [
                TestStateService
            ],
        });
        service = TestBed.get(TestStateService);
    });

    it('mutations was register', () => {
        expect(TestStateService.loadMutation).toEqual(TestMutations.Load);
        expect(TestStateService.loadSuccessMutation).toEqual(TestMutations.LoadSuccess);
        expect(TestStateService.loadFailMutation).toEqual(TestMutations.LoadFail);
    });

    it('set loading state', () => {
        service.load();
        expect(service.Loading).toBeTruthy();
        expect(service.Loaded).toBeFalsy();
        expect(service.Data).toEqual([]);
    });

    it('emit OnMutations and see result', () => {
        service.data$.subscribe((d) => {
            if (d && d.length === 3) {
                expect(service.Loading).toBeFalsy();
                expect(service.Loaded).toBeTruthy();
                expect(service.Data.length).toEqual(3);
                expect(service.Data[0].id).toEqual(1);
                expect(service.Data[1].id).toEqual(2);
                expect(service.Data[2].id).toEqual(3);
            }
        });
        service.load();
    });
});
