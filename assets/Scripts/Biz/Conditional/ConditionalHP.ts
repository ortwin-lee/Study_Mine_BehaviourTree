import {NodeStatus} from "db://assets/Scripts/BehaviourTree/Enum";
import BTConditional from "db://assets/Scripts/BehaviourTree/Base/BTConditional";
import BlackBoard from "db://assets/Scripts/Biz/BlackBoard";

export default class ConditionalHP extends BTConditional {
    onUpdate() {
        console.log("Blackboard.Instance.hp:", BlackBoard.Instance.hp, " ,ConditionalHP判断结果为：", BlackBoard.Instance.hp >= 100);
        if (BlackBoard.Instance.hp >= 100) {
            return NodeStatus.Success;
        }
        return NodeStatus.Failure;
    }
}