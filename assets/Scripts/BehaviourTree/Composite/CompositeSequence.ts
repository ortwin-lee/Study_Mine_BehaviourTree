/**
 * @date: Wed Mar 15 2023 02:21:09 GMT+0800 (中国标准时间)
 * @filename: CompositeSequence.ts
 * @author: alinda
 * @url: db://assets/Scripts/Biz/Composite/CompositeSequence.ts
 */

import BTComposite from "db://assets/Scripts/BehaviourTree/Base/BTComposite";
import {NodeStatus} from "../Enum";

export default class CompositeSequence extends BTComposite {

    public onStart() {
        super.onStart();
        this.index = 0;
    }

    public canExecute(): boolean {
        return this.index < this.children.length && this.status !== NodeStatus.Failure;
    }

    public onChildExecuted(status: NodeStatus): void{
        switch (status) {
            case NodeStatus.Success:
                this.index++;
                if(this.index >= this.children.length) {
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
        this.index = index;
        this.status = NodeStatus.Inactive;
    }

    // public onUpdate(): NodeStatus {
    //     if(this.status === NodeStatus.Failure) {
    //         return NodeStatus.Failure;
    //     }
    //
    //     if(this.index >= this.children.length) {
    //         this.status = NodeStatus.Success;
    //         return NodeStatus.Success;
    //     }
    //
    //     let res = this.children[this.index].run();
    //     if(res === NodeStatus.Success) {
    //         this.index++;
    //     } else if( res === NodeStatus.Failure) {
    //         this.status = NodeStatus.Failure;
    //         return NodeStatus.Failure;
    //     }
    //
    //     return NodeStatus.Running;
    // }
}


