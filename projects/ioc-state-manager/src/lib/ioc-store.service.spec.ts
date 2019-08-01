import {TestBed} from '@angular/core/testing';
import {IUser, OtherService, TestMutations, TestStateService} from './test_cases/test-state.service';
import {zip} from 'rxjs';

describe('IocStateService', () => {

    let service: TestStateService = null;
    beforeAll(() => {
        TestBed.configureTestingModule({
            providers: [
                OtherService,
                TestStateService
            ],
        });
        service = TestBed.get(TestStateService);
    });

    it('inject other Angular Services', () => {
        expect(service.otherService).toBeDefined();
    });

    it('has DefaultState', () => {
        expect(service.Version).toBe(0);
        expect(service.AfterMutation).toBeNull();
    });

    it('can execute a Mutation on the Store', () => {
        expect(service.Version).toBe(0);
        service.FirstMutation(5);
        expect(service.Version).toBe(5);
    });

    it('fires on mutation trigger', () => {
        service.ThirdMutation(88);
        expect(service.AfterMutation.type).toBe(TestMutations.TestMutation3);
        expect(service.AfterMutation.payload).toBe(88);
    });

    it('fire EventEmitters', (done) => {
        service.onVersionChange.subscribe((d: number) => {
            if (d !== 0) {
                expect(d).toBe(42);
                done();
            }
        });
        service.FirstMutation(42);
    });

    it('fire EventEmitters with subobjects', (done) => {
        service.onComplexChange.subscribe((d: IUser) => {
            if (d.id !== 1) {
                expect(d.id).toBe(42);
                expect(d.name).toBe('other');
                done();
            }
        });
        service.ChangeUser({id: 42, name: 'other'});
    });

    it('fire EventEmitters with subobjects change key', (done) => {
        service.onComplexChange.subscribe((d: IUser) => {
            if (d.id !== 1) {
                expect(d.name).toBe('klaus');
                done();
            }
        });
        service.ChangeUserName('klaus');
    });

    it('fire outer EventEmitters when only change one Object key', (done) => {
        zip(
            service.onComplexChange,
            service.onComplexNameChange,
        ).subscribe((values) => {
            if ((values[0] as IUser).name !== 'Udo') {
                expect((values[0] as IUser).name).toBe('peter');
                expect(values[1]).toBe('peter');
                done();
            }
        });
        service.ChangeUserName('peter');
    });

    it('can access this Instance on Mutation', () => {
        service.CheckThisInstance();
        expect(service.MutationThis).toBe('this exists');
        expect(service.OnMutationThis).toBe('this exists');
    });
});
