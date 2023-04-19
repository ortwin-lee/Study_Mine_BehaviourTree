export enum NodeStatus {
    Inactive = 0,
    Running = 1,
    Success = 2,
    Failure = 3
}

/**
 * None 不中断节点运行
 * LowPriority 中断低优先级的节点运行
 * Self 中断同一组合节点下的节点运行
 * Both 同时具有LowPriority和Self
 */
export enum AbortType {
    None = 0,
    LowPriority = 1,
    Self = 2,
    Both = 3
}