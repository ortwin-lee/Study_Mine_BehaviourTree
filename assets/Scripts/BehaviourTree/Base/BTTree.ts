/**
  * @Author: alinda
  * @DateTime: Tue Mar 14 2023 03:19:37 GMT+0800 (中国标准时间)
  * @FileBasename: BTTree
  * @Location: db://assets/Scripts/Base/BTTree.ts
  */
import BTNode from "db://assets/Scripts/BehaviourTree/Base/BTNode";

export default abstract class BTTree {
    public root!: BTNode;
}
