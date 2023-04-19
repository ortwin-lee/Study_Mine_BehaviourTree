/**
  * @Author: alinda
  * @DateTime: Mon Mar 13 2023 21:28:11 GMT+0800 (中国标准时间)
  * @FileBasename: BTNode
  * @Location: db://assets/Scripts/Base/BTNode.ts
  */
import {NodeStatus} from "../Enum";

export default abstract class BTNode{
    private _status: NodeStatus = NodeStatus.Inactive;

    public get status(): NodeStatus {
        return this._status;
    }

    public set status(newStatus: NodeStatus) {
        this._status = newStatus;
    }

    public run(): NodeStatus {
        if(this.status === NodeStatus.Inactive) {
            this.onStart();
        }

        const res = this.onUpdate();

        if(res !== NodeStatus.Running) {
            this.onEnd();
        }

        return res;

    }

    public onStart() {
        this.status = NodeStatus.Running;
    }

    public onUpdate(): NodeStatus {
        return NodeStatus.Success;
    }

    public onEnd() {
        this.status = NodeStatus.Inactive;
    }
}