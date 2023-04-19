/**
 * @date: Tue Mar 14 2023 03:24:45 GMT+0800 (中国标准时间)
 * @filename: BehaviourManager.ts
 * @author: alinda
 * @url: db://assets/Scripts/BehaviourManager.ts
 */
import {_decorator, Component, macro} from 'cc';
import BTTree from "db://assets/Scripts/BehaviourTree/Base/BTTree";
import MyTree from "db://assets/Scripts/Biz/Tree/MyTree";
import {AbortType, NodeStatus} from "db://assets/Scripts/BehaviourTree/Enum";
import BTNode from "db://assets/Scripts/BehaviourTree/Base/BTNode";
import BTParent from "db://assets/Scripts/BehaviourTree/Base/BTParent";
import {BTDecorator} from "db://assets/Scripts/BehaviourTree/Base/BTDecorator";
import BTComposite from "db://assets/Scripts/BehaviourTree/Base/BTComposite";
import BTConditional from "db://assets/Scripts/BehaviourTree/Base/BTConditional";
import BlackBoard from "db://assets/Scripts/Biz/BlackBoard";

const {ccclass} = _decorator;

@ccclass('BehaviourManager')
export class BehaviourManager extends Component {
    public tree!: BTTree;
    public nodeList: Array<BTNode> = [];
    public activeStack: Array<Array<number>> = [];
    public parentIndex: Array<number> = [];
    public childrenIndex: Array<Array<number> | null> = [];

    public restartWhenComplete: boolean = true;

    //当前元素是父类的第几个孩子
    public relativeChildIndex: Array<number> = [];
    //最近的一个组合节点父类的index
    public parentCompositeIndex: Array<number> = [];
    //孩子是条件节点的对应孩子的索引组成的数组
    public childrenConditionalIndex: Array<Array<number> | null> = [];


    public conditionalReevaluate: Array<ConditionalReevaluate> = []
    public conditionalReevaluateMap: Map<number, ConditionalReevaluate> = new Map();

    start() {
        this.enableBehavior();

        this.scheduleOnce(() => {
            console.log("————————————————————————>加血");
            BlackBoard.Instance.hp = 100;
        }, 3)
    }

    update() {
        // this.tree.root.run();
        this.tick();
    }

    restart() {
        console.log("重启行为树");
        this.stackPushNode(0, 0);
        this.removeChildConditionalReevaluate(-1);
    }

    public enableBehavior() {
        this.tree = new MyTree();
        this.activeStack.push([]);
        this.parentIndex.push(-1);
        this.relativeChildIndex.push(-1);
        this.parentCompositeIndex.push(-1);
        this.addToNodeList(this.tree.root, {parentCompositeIndex: -1});
        this.stackPushNode(0, 0);
    }

    public addToNodeList(node: BTNode, data: { parentCompositeIndex: number }) {
        this.nodeList.push(node);
        let nodeIndex = this.nodeList.length - 1;
        if (node instanceof BTParent) {
            this.childrenIndex.push([]);
            this.childrenConditionalIndex.push([]);
            for (let i = 0; i < node.children.length; i++) {
                this.parentIndex.push(nodeIndex);
                this.childrenIndex[nodeIndex]!.push(this.nodeList.length);

                //中断处理
                this.relativeChildIndex.push(i);
                if (node instanceof BTComposite) {
                    data.parentCompositeIndex = nodeIndex;
                }
                this.parentCompositeIndex.push(data.parentCompositeIndex);
                this.addToNodeList(node.children[i], data);
            }
        } else {
            this.childrenIndex.push(null);
            this.childrenConditionalIndex.push(null);
            if (node instanceof BTConditional) {
                const parentCompositeIndex = this.parentCompositeIndex[nodeIndex];
                if (parentCompositeIndex !== -1) {
                    this.childrenConditionalIndex[parentCompositeIndex]!.push(nodeIndex);
                }
            }
        }
    }

    public tick(): void {
        this.reevaluateConditionalNode();
        for (let i = this.activeStack.length - 1; i >= 0; i--) {
            const stack = this.activeStack[i];
            let preIndex = -1;
            let preStatus = NodeStatus.Inactive;
            while (preStatus !== NodeStatus.Running && i < this.activeStack.length && stack.length !== 0) {
                const curIndex = stack[stack.length - 1];
                if (curIndex === preIndex) {
                    break;
                }
                preIndex = curIndex;
                preStatus = this.stackRunNode(curIndex, i, preStatus);
            }

        }
    }


    public stackRunNode(index: number, stackIndex: number, preStatus: NodeStatus): NodeStatus {
        this.stackPushNode(index, stackIndex);
        const node = this.nodeList[index];
        let status = preStatus;
        if (node instanceof BTParent) {
            status = this.stackRunParentNode(index, stackIndex, status);
            if (node.canRunParallelChildren()) {
                status = node.status;
            }
        } else {
            status = node.onUpdate();
        }

        if (status !== NodeStatus.Running) {
            status = this.stackPopNode(index, stackIndex, status);
        }

        return status;
    }

    public stackRunParentNode(index: number, stackIndex: number, status: NodeStatus) {
        let node = this.nodeList[index] as BTParent;

        if (!node.canRunParallelChildren() || node.status !== NodeStatus.Running) {
            let childStatus = NodeStatus.Inactive;
            while (node.canExecute() && (childStatus !== NodeStatus.Running || node.canRunParallelChildren())) {
                const childIndex = node.index;
                if (node.canRunParallelChildren()) {
                    this.activeStack.push([]);
                    stackIndex = this.activeStack.length - 1;
                    node.onChildStarted();
                }

                childStatus = status = this.stackRunNode(this.childrenIndex[index]![childIndex], stackIndex, status);
            }
        }
        return status;
    }

    public stackPushNode(index: number, stackIndex: number): void {
        const stack = this.activeStack[stackIndex];
        if (stack.length === 0 || stack[stack.length - 1] !== index) {
            stack.push(index);
            let node = this.nodeList[index];
            console.log("stackPushNode", node);
            node.onStart();
        }
    }

    public stackPopNode(index: number, stackIndex: number, status: NodeStatus, popChildren: boolean = true): NodeStatus {
        const stack = this.activeStack[stackIndex];
        stack.pop();
        let node = this.nodeList[index];
        node.onEnd();
        console.log('stackPopNode', node);
        const parentIndex = this.parentIndex[index];
        if (parentIndex !== -1) {
            if (node instanceof BTConditional) {
                const parentCompositeIndex = this.parentCompositeIndex[index];
                if (parentCompositeIndex !== -1) {
                    const compositeNode = this.nodeList[parentCompositeIndex] as BTComposite;
                    if (compositeNode.abortType !== AbortType.None) {
                        if (this.conditionalReevaluateMap.has(index)) {
                            const conditionalReevaluate = this.conditionalReevaluateMap.get(index)!;
                            conditionalReevaluate.compositeIndex = -1;
                            conditionalReevaluate.status = status;
                        } else {
                            const conditionalReevaluate = new ConditionalReevaluate(index, status, compositeNode.abortType === AbortType.LowPriority ? -1 : parentCompositeIndex);
                            console.log('生成conditionalReevaluate', conditionalReevaluate)
                            this.conditionalReevaluate.push(conditionalReevaluate);
                            this.conditionalReevaluateMap.set(index, conditionalReevaluate);
                        }
                    }
                }
            }


            const parentNode = this.nodeList[parentIndex] as BTParent;

            if (node instanceof BTDecorator) {
                status = node.decorate(status);
            }
            parentNode.onChildExecuted(status, this.relativeChildIndex[index]);
        }

        if (node instanceof BTComposite) {
            if (node.abortType === AbortType.Self || node.abortType === AbortType.None || stack.length === 0) {
                //self属性的条件不是全局的，只在当前组合下有效，当前组合退出运行栈时，删除所属的所有重评估条件
                this.removeChildConditionalReevaluate(index);
            } else if (node.abortType === AbortType.LowPriority || node.abortType === AbortType.Both) {
                for (let i = 0; i < this.childrenConditionalIndex[index]!.length; i++) {
                    const childConditionalIndex = this.childrenConditionalIndex[index]![i];
                    const conditionalReevaluate = this.conditionalReevaluateMap.get(childConditionalIndex);
                    conditionalReevaluate!.compositeIndex = this.parentCompositeIndex[index];
                }

                for (let i = 0; i < this.conditionalReevaluate.length; i++) {
                    const conditionalReevaluateElement = this.conditionalReevaluate[i];
                    if (conditionalReevaluateElement.compositeIndex === index) {
                        conditionalReevaluateElement.compositeIndex = this.parentCompositeIndex[index];
                    }

                }
            }
        }


        if (popChildren) {
            for (let i = this.activeStack.length - 1; i > stackIndex; i--) {
                const stack = this.activeStack[i];
                if (stack.length >= 0 && this.isParentNode(index, stack[stack.length - 1])) {
                    for (let j = stack.length - 1; j >= 0; j--) {
                        this.stackPopNode(stack[stack.length - 1], i, NodeStatus.Failure, false);
                    }
                }
            }
        }


        if (stack.length === 0) {
            if (stackIndex === 0) {
                if (this.restartWhenComplete) {
                    this.restart();
                }
            } else {
                this.activeStack.splice(stackIndex, 1);
            }
        }

        return status;
    }


    public removeChildConditionalReevaluate(index: number) {
        for (let i = this.conditionalReevaluate.length - 1; i >= 0; i--) {
            const conditionalReevaluate = this.conditionalReevaluate[i];
            if (conditionalReevaluate.compositeIndex === index) {
                console.log('移除conditionalReevaluate', conditionalReevaluate)
                this.conditionalReevaluateMap.delete(conditionalReevaluate.index);
                this.conditionalReevaluate.splice(i, 1);
            }
        }
    }


    public reevaluateConditionalNode() {
        //◆◆◆◆每个栈的栈顶元素，是正在Running的元素◆◆◆◆
        for (let i = this.conditionalReevaluate.length - 1; i >= 0; i--) {
            const {index, status: preStatus, compositeIndex} = this.conditionalReevaluate[i];

            if (compositeIndex === -1) {
                continue;
            }

            const status = this.nodeList[index].onUpdate();
            if (status === preStatus) {
                continue;
            }


            //因为可能一个并行节点下的所有节点都要被一个重评估条件中断，所以每个栈都需要判断处理
            for (let j = this.activeStack.length - 1; j >= 0; j--) {
                const stack = this.activeStack[j];
                //删除触发时运行的节点到公共父节点之间的所有节点
                let curNodeIndex = stack[stack.length - 1];
                const commonParentIndex = this.findCommonParentIndex(curNodeIndex, index);
                if (this.isParentNode(compositeIndex, commonParentIndex)) {
                    const stackLen = this.activeStack.length;
                    while (curNodeIndex !== -1 && curNodeIndex !== commonParentIndex && stackLen === this.activeStack.length) {
                        this.stackPopNode(curNodeIndex, j, NodeStatus.Failure, false);
                        curNodeIndex = this.parentIndex[curNodeIndex];
                    }
                }
            }

            //删除重评估条件节点右边的所有重评估条件节点
            for (let j = this.conditionalReevaluate.length - 1; j >= i; j--) {
                const conditionalReevaluate = this.conditionalReevaluate[j];
                if (this.isParentNode(compositeIndex, conditionalReevaluate.index)) {
                    this.conditionalReevaluateMap.delete(conditionalReevaluate.index);
                    this.conditionalReevaluate.splice(j, 1);
                }

            }

            //如果当前重评估条件节点所属的组合节点有其它重评估条件节点，并且该组合节点为LowPriority，则关闭组合节点的其它重评估条件节点
            const compositeNode = this.nodeList[this.parentCompositeIndex[index]] as BTComposite;
            for (let j = i - 1; j >= 0; j--) {
                const preConditionalReevaluate = this.conditionalReevaluate[j];
                if (this.parentCompositeIndex[preConditionalReevaluate.index] === this.parentCompositeIndex[index]) {
                    if (compositeNode.abortType === AbortType.LowPriority) {
                        preConditionalReevaluate.compositeIndex = -1;
                    }
                }
            }

            //该重评估条件节点所属的组合节点至公共父节点直接的所有节点触发onConditionalAbort，目的是调整下次行为树执行顺序以实现中断
            //其中 compositeIndex 就是 当前被中断的栈顶运行节点 与 条件节点 的 最近公共父节点
            const conditionalParentIndex = [];
            for (let j = this.parentIndex[index]; j !== compositeIndex; j = this.parentIndex[j]) {
                conditionalParentIndex.push(j);
            }
            conditionalParentIndex.push(compositeIndex);
            for (let j = conditionalParentIndex.length - 1; j >= 0; j--) {
                const parentNode = this.nodeList[conditionalParentIndex[j]] as BTParent;
                if (j === 0) {
                    parentNode.onConditionalAbort(this.relativeChildIndex[index]);
                } else {
                    parentNode.onConditionalAbort(this.relativeChildIndex[conditionalParentIndex[j - 1]]);
                }
            }
        }
    }

    public findCommonParentIndex(index1: number, index2: number) {
        const set = new Set<number>();
        let num = index1;
        while (num != -1) {
            set.add(num);
            num = this.parentIndex[num];
        }

        num = index2;
        while (!set.has(num)) {
            num = this.parentIndex[num];
        }

        return num;
    }

    public isParentNode(parentIndex: number, childIndex: number) {
        for (let i = childIndex; i !== -1; i = this.parentIndex[i]) {
            if (i === parentIndex) {
                return true;
            }
        }
        return false;
    }


}


class ConditionalReevaluate {
    constructor(public index: number, public status: NodeStatus, public compositeIndex: number) {

    }
}