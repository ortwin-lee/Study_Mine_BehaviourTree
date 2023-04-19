/**
  * @Author: alinda
  * @DateTime: Tue Mar 14 2023 01:56:48 GMT+0800 (中国标准时间)
  * @FileBasename: BTParent
  * @Location: db://assets/Scripts/Base/BTParent.ts
  */
import BTNode from './BTNode';
import {NodeStatus} from "db://assets/Scripts/BehaviourTree/Enum";

export default abstract class BTParent extends BTNode {
    public children: Array<BTNode> = [];
    private _index: number = 0;

    constructor(children: Array<BTNode>) {
        super();
        this.children = children;
    }

    public get index(): number {
        return this._index;
    }

    public set index(index: number) {
        this._index = index;
    }

    public abstract canExecute(): boolean;
    public abstract onChildExecuted(status: NodeStatus, index?: number): void;

    public abstract onConditionalAbort(index: number): void;

    public canRunParallelChildren(){
        return false;
    }

    public onChildStarted() {

    }
}