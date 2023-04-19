/**
  * @Author: alinda
  * @DateTime: Tue Mar 14 2023 01:57:02 GMT+0800 (中国标准时间)
  * @FileBasename: BTComposite
  * @Location: db://assets/Scripts/Base/BTComposite.ts
  */
import BTParent from "db://assets/Scripts/BehaviourTree/Base/BTParent";
import {AbortType} from "db://assets/Scripts/BehaviourTree/Enum";
import BTNode from "db://assets/Scripts/BehaviourTree/Base/BTNode";

export default abstract class BTComposite extends BTParent {
    public abortType: AbortType;

    constructor(children: Array<BTNode> = [], abortType: AbortType = AbortType.None) {
        super(children);
        this.abortType = abortType;
    }
}