# IOC State Manager

The IOC State Manager is a State Management for Angular based on injectable services.

The picture library was inspired by Redux and @ngrx/store

The aim is not to split the code for the actions, reducers, effects and selectors into too many individual files, but to encapsulate it in a single service.

### Installation

```bash
npm i --save ioc-state-manager
```

### Components

##### StateNames
> Every State Object must have a State Name to identify it
> This Name must be Unique over all States

##### StateServices:
> Holds the Mutations and the Accessors for a State in one single Service File

##### Mutations
> Defines the State Mutation when an Action was executed

##### Side Effects (OnMutations)
> Defines What happens when an Action mutates the State

##### Getter Functions:
> Access the current State Values one times

##### Event Emitter
> listen every State Property changes

### Best Practice

###### create an Enum for all the State Names

```javascript
export enum TestStateNames {
    TEST = 'test',
    // other State Names...
}
```

###### create a Interface(s) that represent the State Object

```javascript
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
```

###### create an Mutation String Enum for all State Mutations

```javascript
export enum TestMutations {
    TestMutation1 = '[test] mutation1',
    TestMutation2 = '[test] mutation2',
    TestMutation3 = '[test] mutation3',
    TestMutation4 = '[test] mutation4',
    TestMutation5 = '[test] mutation5',
    TestMutation6 = '[test] mutation6',
    SetAfterMutation = '[test] set after mutation',
}
```

###### implement a Angular Service that have all State Mutations and Side Effects and Selectors

```javascript
@Injectable()
export class TestStateService extends IocService<ITestState> {
    constructor(
        public otherService: OtherService
    ) {
        // register the new State in the Store Object
        // first we pass the State Name from the StateNames Enumerable
        // second we pass an Object that is the Default State
        super(TestStateNames.TEST, {
            version: 0,
            complex: {
                id: 1,
                name: 'John',
            },
            onMutation: null,
            mutationThis: null,
            onMutationThis: null,
        });
    }
    
    testThis = 'this exists';
    
    // this gets the version Property from the State
    get Version() {
        return this.state().version;
    }

    // this gets the complex Property from the State
    get Complex() {
        return this.state().complex;
    }
    
    // on the EventEmitter we can subscribe and listen 
    // for changes of the version Property from the State
    onVersionChange = this.listen<number>((s) => s.version);

    // Define and handel´s a State Mutation
    // the second Parameter was passed automatically and is every time optional !
    // the first Parameter is only defined when the Mutation has a Payload !
    @Mutation(TestMutations.TestMutation1)
    FirstMutation(payload: number, s?: ITestState): void {
        s.version = payload;
    }

    // defines a Side Effect that is triggerd when TestMutation3 has changed the State
    // it has only the mutation as Parameter
    @OnMutation(TestMutations.TestMutation3)
    private _afterThirdMutation(mutation: IMutation): void {
        this.FirstMutation(mutation);
    }
}
```

### Usage

```javascript
@Component()
export class ExampleComponent {
    // connect to the State Listener
    // now we can use the demoListener with the async Pipe
    demoListener = this.testService.onVersionChange;
    
    constructor(private testService: TestStateService) {}
    
    doSomething() {
        // get the current Version from the State
        const currentVersion = this.testService.Version;
        // increment it and Mutate the Version in the State with new Value
        this.testService.FirstMutation(currentVersion+2);
    }
}
```
