import {NodeStatus} from "db://assets/Scripts/BehaviourTree/Enum";
import BTConditional from "db://assets/Scripts/BehaviourTree/Base/BTConditional";
import BlackBoard from "db://assets/Scripts/Biz/BlackBoard";

export default class ConditionalMP extends BTConditional {
    onUpdate() {
        console.log("Blackboard.Instance.mp:", BlackBoard.Instance.mp, " ,ConditionalMP判断结果为：", BlackBoard.Instance.mp >= 100);
        if (BlackBoard.Instance.mp >= 100) {
            return NodeStatus.Success;
        }
        return NodeStatus.Failure;
    }
}