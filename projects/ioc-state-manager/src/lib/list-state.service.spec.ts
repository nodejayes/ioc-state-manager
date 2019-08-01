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
        expect(TestStateService.loadMutation).toBeDefined();
        expect(TestStateService.loadMutation).toEqual(TestMutations.Load);
    });

    it('mutation can calling', () => {
        service.load();
        expect(service.Loading).toBeTruthy();
        expect(service.Loaded).toBeFalsy();
        expect(service.Data).toEqual([]);
    });
});
