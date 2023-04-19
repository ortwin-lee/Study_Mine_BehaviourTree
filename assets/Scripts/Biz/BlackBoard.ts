import Singleton from "db://assets/Scripts/BehaviourTree/Utils/Singleton";

export default class BlackBoard extends Singleton{
    public mp: number = 0;
    public hp: number = 0;

    static get Instance():any{
        return super.GetInstance<BlackBoard>();
    }
}
