import BTComposite from "db://assets/Scripts/BehaviourTree/Base/BTComposite";
import {NodeStatus} from "../Enum";
import {shufflePosition} from "db://assets/Scripts/BehaviourTree/Utils/RandomUtils"

export default class CompositeRandomSequence extends BTComposite{
    private _executionOrder:Array<number> = [];

    public get index(): number {
        return this._executionOrder[this._executionOrder.length-1];
    }

    public onStart() {
        super.onStart();
        this._executionOrder = shufflePosition(this.children.length);
    }

    public canExecute(): boolean {
        return this._executionOrder.length > 0 && this.status !== NodeStatus.Failure;
    }

    public onChildExecuted(status: NodeStatus): void{
        switch (status) {
            case NodeStatus.Success:
                this._executionOrder.pop();
                if(this._executionOrder.length === 0) {
                    this.status = NodeStatus.Success;
                } else {
                    this.status = NodeStatus.Running;
                }
                break;
            case NodeStatus.Running:
                this.status = NodeStatus.Running;
                break;
            case NodeStatus.Failure:
                this.status = NodeStatus.Failure;
                break;
        }
    }

    public onConditionalAbort(index: number): void {
        this._executionOrder = shufflePosition(this.children.length);
        this.status = NodeStatus.Inactive;
    }

    // public onUpdate(): NodeStatus {
    //     if(this.status === NodeStatus.Failure) {
    //         return NodeStatus.Failure;
    //     }
    //
    //     if(this._executionOrder.length === 0) {
    //         this.status = NodeStatus.Success;
    //         return NodeStatus.Success;
    //     }
    //
    //     let res = this.children[this.index].run();
    //
    //     if( res === NodeStatus.Failure) {
    //         this.status = NodeStatus.Failure;
    //         return NodeStatus.Failure;
    //     } else if (res === NodeStatus.Success) {
    //         this._executionOrder.pop();
    //     }
    //
    //     return NodeStatus.Running;
    // }

}