import BTTree from "db://assets/Scripts/BehaviourTree/Base/BTTree";
import CompositeSequenceSelector from "db://assets/Scripts/BehaviourTree/Composite/CompositeSequenceSelector";
import {AbortType} from "db://assets/Scripts/BehaviourTree/Enum";
import CompositeParallel from "db://assets/Scripts/BehaviourTree/Composite/CompositeParallel";
import ConditionalHP from "db://assets/Scripts/Biz/Conditional/ConditionalHP";
import ActionWork from "db://assets/Scripts/Biz/Action/ActionWork";
import ConditionalMP from "db://assets/Scripts/Biz/Conditional/ConditionalMP";
import ActionSleep from "db://assets/Scripts/Biz/Action/ActionSleep";
import DecoratorRepeater from "db://assets/Scripts/BehaviourTree/Decorator/DecoratorRepeater";
import CompositeSequence from "db://assets/Scripts/BehaviourTree/Composite/CompositeSequence";
import ActionSkill from "db://assets/Scripts/Biz/Action/ActionSkill";
import ActionWait from "db://assets/Scripts/Biz/Action/ActionWait";
import ActionAttack from "db://assets/Scripts/Biz/Action/ActionAttack";
import CompositeRandomSequence from "db://assets/Scripts/BehaviourTree/Composite/CompositeRandomSequence";

export default class MyTree extends BTTree {
    constructor() {
        super();
        this.init();
    }

    init() {
        // this.root = new ActionLog('hello world')

        // this.root = new CompositeSequence([
        //     new CompositeSequenceSelector([
        //         new CompositeSequence([
        //             new ConditionalMP(),
        //             new CompositeSequence([
        //                 new ActionWait(),
        //                 new ActionSkill()
        //             ])
        //         ], AbortType.Self),
        //         new CompositeSequence([
        //             new ConditionalHP(),
        //             new ActionAttack()
        //         ]),
        //         new CompositeRandomSequence([
        //             new ActionWork(),
        //             new ActionSleep()
        //         ])
        //     ])
        // ]);


        // this.root = new CompositeSequence([
        //     new DecoratorInverter([new DecoratorInverter([new ActionLog('haha')])]),
        //     new ActionLog('hei hei')
        // ])

        // this.root = new CompositeSequenceSelector([
        //     new CompositeParallel([
        //         new ActionWait(),
        //         new ActionWork(),
        //         new CompositeParallel([
        //             new ActionSkill(),
        //             new ActionWork(),
        //             new ActionAttack()
        //         ]),
        //         new ActionSleep()
        //     ]),
        // ]);

        this.root = new CompositeSequenceSelector([
            new CompositeParallel([
                new CompositeSequenceSelector([
                    new ConditionalHP(),
                    new ActionWork(4000)
                ], AbortType.Self),
                new CompositeSequenceSelector([
                    new ConditionalMP(),
                    new ActionSleep(8000)
                ], AbortType.Self)
            ]),
        ]);

        // this.root = new CompositeSequenceSelector([
        //     new DecoratorRepeater([
        //         new ConditionalMP()
        //     ], 3, true)
        // ]);

    }

}
