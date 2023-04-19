import BTAction from "db://assets/Scripts/BehaviourTree/Base/BTAction";
import {NodeStatus} from "../../BehaviourTree/Enum";

export default class ActionFailure extends BTAction {
    onUpdate() {
        console.log('Mission failed!')
        return NodeStatus.Failure;
    }
}