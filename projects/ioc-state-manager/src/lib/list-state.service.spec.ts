import {TestMutations, TestStateService} from './test_cases/test-list-state.service';
import {TestBed} from '@angular/core/testing';
import {find} from 'lodash';

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

    it('emit OnMutations and see result', (done) => {
        service.data$.subscribe((d) => {
            if (d && d.length === 3) {
                // TODO: have state set before invoke this function ?
                /*
                expect(service.Loading).toBeFalsy();
                expect(service.Loaded).toBeTruthy();
                */
                expect(d.length).toEqual(3);
                expect(d[0].id).toEqual(1);
                expect(d[1].id).toEqual(2);
                expect(d[2].id).toEqual(3);
                done();
            }
        });
        service.load();
    });

    it('set error message when load', () => {
        service.testErrorLoad();
        expect(service.Loading).toBeFalsy();
        expect(service.Loaded).toBeFalsy();
        expect(service.Error).toEqual('error_message');
    });

    it('create new objects', (done) => {
        service.data$.subscribe((d) => {
            const found = find(d, e => e.id === 5);
            if (found) {
                expect(found.name).toEqual('Karin');
                done();
            }
        });
        service.create([
            {id: 5, name: 'Karin'},
        ]);
    });

    it('update existing objects', (done) => {
        service.create([
            {id: 6, name: ''},
        ]);

        service.data$.subscribe(d => {
            const found = find(d, e => e.id === 6);
            if (found && found.name.length > 0) {
                expect(found.name).toEqual('updated');
                done();
            }
        });
        service.update([
            {id: 6, name: 'updated'},
        ]);
    });

    it('delete existing objects', (done) => {
        service.create([
            {id: 7, name: 'delete me'},
            {id: 8, name: 'delete me not'},
        ]);

        service.data$.subscribe(d => {
            const found = find(d, e => e.id === 8);
            const deleted = find(d, e => e.id === 7);
            if (found && !deleted) {
                expect(deleted).toBeUndefined();
                done();
            }
        });
        service.delete([7]);
    });
});
