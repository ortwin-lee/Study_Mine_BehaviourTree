import {game} from "cc";
import BTAction from "db://assets/Scripts/BehaviourTree/Base/BTAction";
import {NodeStatus} from "../../BehaviourTree/Enum";
import BlackBoard from "db://assets/Scripts/Biz/BlackBoard";

export default class ActionWork extends BTAction {
    private readonly _duration: number = 0;
    private _startTime: number = 0;

    constructor(duration:number = 2000) {
        super();
        this._duration = duration;
    }

    public onStart() {
        super.onStart();
        this._startTime = game.totalTime;
        console.log("ActionWork onStart");
    }

    public onUpdate() {
        if(game.totalTime - this._startTime > this._duration) {
            return NodeStatus.Success;
        }

        return NodeStatus.Running;
    }

    public onEnd() {
        super.onEnd();
        console.log('ActionWork onEnd')
    }
}