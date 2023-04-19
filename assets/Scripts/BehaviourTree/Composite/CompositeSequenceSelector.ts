/**
 * @date: Wed Mar 15 2023 03:40:02 GMT+0800 (中国标准时间)
 * @filename: CompositeSelector.ts
 * @author: alinda
 * @url: db://assets/Scripts/BehaviourTree/Composite/CompositeSelector.ts
 */

import BTComposite from "db://assets/Scripts/BehaviourTree/Base/BTComposite";
import {NodeStatus} from "../Enum";

export default class CompositeSequenceSelector extends BTComposite {
    public onStart() {
        super.onStart();
        this.index = 0;
    }

    public canExecute(): boolean {
        return this.index < this.children.length && this.status !== NodeStatus.Success;
    }

    public onChildExecuted(status: NodeStatus): void{
        switch (status) {
            case NodeStatus.Success:
                this.status = NodeStatus.Success;
                break;
            case NodeStatus.Running:
                this.status = NodeStatus.Running;
                break;
            case NodeStatus.Failure:
                this.index++;
                if(this.index >= this.children.length) {
                    this.status = NodeStatus.Failure;
                } else {
                    this.status = NodeStatus.Running;
                }
                break;
        }
    }

    public onConditionalAbort(index: number): void {
        this.index = index;
        this.status = NodeStatus.Inactive;
    }

    // public onUpdate(): NodeStatus {
    //     if(this.status === NodeStatus.Failure) {
    //         return NodeStatus.Failure;
    //     }
    //
    //     if(this.index >= this.children.length) {
    //         this.status = NodeStatus.Failure;
    //         return NodeStatus.Failure;
    //     }
    //
    //     let res = this.children[this.index].run();
    //     if(res === NodeStatus.Success) {
    //         this.status = NodeStatus.Success;
    //         return NodeStatus.Success;
    //     } else if( res === NodeStatus.Failure) {
    //         this.index++;
    //     }
    //
    //     return NodeStatus.Running;
    // }
}


