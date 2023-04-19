/**
 * @Author: alinda
 * @DateTime: Wed Mar 15 2023 19:40:41 GMT+0800 (中国标准时间)
 * @FileBasename: DecoratorInverter
 * @Location: db://assets/Scripts/BehaviourTree/Decorator/DecoratorInverter.ts
 */
import {BTDecorator} from "db://assets/Scripts/BehaviourTree/Base/BTDecorator";
import {NodeStatus} from "../Enum";

export default class DecoratorInverter extends BTDecorator {
    public decorate(status: NodeStatus): NodeStatus {
        switch (status) {
            case NodeStatus.Failure:
                return NodeStatus.Success;
            case NodeStatus.Success:
                return NodeStatus.Failure;
            default:
                return status;
        }
    }

    public canExecute(): boolean{
        return this.status === NodeStatus.Inactive || this.status === NodeStatus.Running;
    }

    public onChildExecuted(status: NodeStatus): void{
        this.status = status;
    }
}