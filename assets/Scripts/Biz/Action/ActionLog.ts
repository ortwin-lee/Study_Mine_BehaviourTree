import BTAction from "db://assets/Scripts/BehaviourTree/Base/BTAction";
import {NodeStatus} from "../../BehaviourTree/Enum";

export default class ActionLog extends BTAction {
    constructor(private text:string) {
        super();
    }

    onUpdate() {
        console.log(this.text)
        return NodeStatus.Success;
    }
}