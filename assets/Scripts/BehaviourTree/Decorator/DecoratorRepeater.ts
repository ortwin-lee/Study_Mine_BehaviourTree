import {BTDecorator} from "db://assets/Scripts/BehaviourTree/Base/BTDecorator";
import {NodeStatus} from "../Enum";
import BTNode from "db://assets/Scripts/BehaviourTree/Base/BTNode";

export default class DecoratorRepeater extends BTDecorator {

    private readonly repeatCount: number;
    private curCount: number = 0;
    private readonly endOnFailure: boolean;

    constructor(children: Array<BTNode>, repeatCount: number = Infinity, endOnFailure: boolean = false) {
        super(children);
        this.repeatCount = repeatCount;
        this.endOnFailure = endOnFailure;
    }

    public canExecute(): boolean {
        return this.curCount < this.repeatCount && (!this.endOnFailure || (this.endOnFailure && this.status !== NodeStatus.Failure));
    }

    public onChildExecuted(status: NodeStatus): void {
        this.curCount++;
        this.status = status;
    }

    public onStart() {
        super.onStart();
        this.curCount = 0;
    }
}