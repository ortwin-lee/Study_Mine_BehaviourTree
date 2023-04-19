/**
 * @date: Tue Mar 14 2023 01:56:33 GMT+0800 (中国标准时间)
 * @filename: BTDecorator.ts
 * @author: alinda
 * @url: db://assets/Scripts/Base/BTDecorator.ts
 */

import {NodeStatus} from "db://assets/Scripts/BehaviourTree/Enum";
import BTNode from "db://assets/Scripts/BehaviourTree/Base/BTNode";
import BTParent from "db://assets/Scripts/BehaviourTree/Base/BTParent";

export abstract class BTDecorator extends BTParent {

    // public onUpdate(): NodeStatus {
    //     const res = this.children[0].run();
    //     return this.decorate(res);
    // }

    public decorate(status: NodeStatus): NodeStatus {
        return status;
    }

    public onConditionalAbort(index: number): void {

    }
}


