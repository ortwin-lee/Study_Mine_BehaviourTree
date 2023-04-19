import BTComposite from "db://assets/Scripts/BehaviourTree/Base/BTComposite";
import {NodeStatus} from "../Enum";

export default class CompositeParallel extends BTComposite {
    public executionStatus: Array<NodeStatus> = [];

    public get status(): NodeStatus {
        let childrenCompleteFlag = true;
        for (let i = 0; i < this.executionStatus.length; i++) {
            if( this.executionStatus[i] === NodeStatus.Running) {
                childrenCompleteFlag = false;
            } else if ( this.executionStatus[i] === NodeStatus.Failure) {
                return NodeStatus.Failure;
            }
        }

        return childrenCompleteFlag ? NodeStatus.Success : NodeStatus.Running;
    }

    public set status(newStatus: NodeStatus) {

    }

    public onStart() {
        super.onStart();
        this.index = 0;
        this.executionStatus = new Array<NodeStatus>(this.children.length);
        for (let i = 0; i < this.executionStatus.length; i++) {
            this.executionStatus[i] = NodeStatus.Inactive;
        }
    }



    public canExecute(): boolean {
        return this.index < this.children.length;
    }

    public onChildExecuted(status: NodeStatus, index: number): void{
        this.executionStatus[index] = status;
    }

    public onConditionalAbort(index: number): void {
        this.index = 0;
        for (let i = 0; i < this.executionStatus.length; i++) {
            this.executionStatus[i] = NodeStatus.Inactive;
        }
    }

    public canRunParallelChildren(){
        return true;
    }

    public onChildStarted() {
        this.executionStatus[this.index] = NodeStatus.Running;
        this.index++;
    }
}


