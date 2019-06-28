import {Injectable} from '@angular/core';
import {IMutation, IocService, Mutation, OnMutation} from '../../public-api';

export enum TestStateNames {
    TEST = 'test',
}

export interface IUser {
    id: number;
    name: string;
}

export interface ITestState {
    version: number;
    complex: IUser;
    onMutation: IMutation;
    onMutationThis: string;
    mutationThis: string;
}

export enum TestMutations {
    TestMutation1 = '[test] mutation1',
    TestMutation2 = '[test] mutation2',
    TestMutation3 = '[test] mutation3',
    TestMutation4 = '[test] mutation4',
    TestMutation5 = '[test] mutation5',
    TestMutation6 = '[test] mutation6',
    SetAfterMutation = '[test] set after mutation',
}

@Injectable()
export class OtherService {
    name = 'other Service';
}

@Injectable()
export class TestStateService extends IocService<ITestState> {
    constructor(
        public otherService: OtherService
    ) {
        super(TestStateNames.TEST, {
            version: 0,
            complex: {
                id: 1,
                name: 'Udo',
            },
            onMutation: null,
            mutationThis: null,
            onMutationThis: null,
        });
    }

    testThis = 'this exists';

    get Version() {
        return this.state().version;
    }

    get Complex() {
        return this.state().complex;
    }

    get AfterMutation() {
        return this.state().onMutation;
    }

    get MutationThis() {
        return this.state().mutationThis;
    }

    get OnMutationThis() {
        return this.state().onMutationThis;
    }

    onVersionChange = this.listen<number>((s) => s.version);

    onComplexChange = this.listen<IUser>((s) => s.complex);

    onComplexNameChange = this.listen<string>((s) => s.complex.name);

    @Mutation(TestMutations.TestMutation1)
    FirstMutation(payload: number, s?: ITestState): void {
        s.version = payload;
    }

    @Mutation(TestMutations.TestMutation2)
    SecondMutation(payload: number, s?: ITestState): void {
        s.version = 99;
    }

    @Mutation(TestMutations.TestMutation3)
    ThirdMutation(payload: number, s?: ITestState): void {
        s.version = 999;
    }

    @Mutation(TestMutations.TestMutation4)
    ChangeUser(payload: IUser, s?: ITestState): void {
        s.complex = payload;
    }

    @Mutation(TestMutations.TestMutation5)
    ChangeUserName(payload: string, s?: ITestState): void {
        if (!s.complex) {
            s.complex = {
                id: 1,
                name: payload
            };
        } else {
            s.complex.name = payload;
        }
    }

    @Mutation(TestMutations.SetAfterMutation)
    SetOnMutation(payload: IMutation, s?: ITestState): void {
        s.onMutation = payload;
    }

    @OnMutation(TestMutations.TestMutation3)
    private _afterThirdMutation(mutation: IMutation): void {
        this.SetOnMutation(mutation);
    }

    @Mutation(TestMutations.TestMutation6)
    CheckThisInstance(s?: ITestState) {
        s.mutationThis = this.testThis;
    }

    @Mutation('demo')
    DemoMutation(value: string, s?: ITestState) {
        s.onMutationThis = value;
    }

    @OnMutation(TestMutations.TestMutation6)
    OnCheckThisInstance(mutation: IMutation) {
        this.DemoMutation(this.testThis);
    }
}
