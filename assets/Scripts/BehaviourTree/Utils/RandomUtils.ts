/**
 * 返回一个随机序列，包含0 ~ length-1 之间的每一个数，且仅包含一次。
 * @param length 随机序列的长度
 * @returns 一个元素为随机序列的数组，如果length小于等于0或者不存在，则返回 []。
 */
export function shufflePosition(length: number):Array<number> {
    if(!length || length <= 0) return [];
    let randIndexArray: number[] = Array.from({length}, (_, i) => i);
    return shuffle(randIndexArray);
}

/**
 * 将传入的数组打乱次序
 * @param array 传入的数组
 * @returns 随机打乱后的数组
 */
export function shuffle<T>(array: Array<T>):Array<T> {
    if(!array) return [];
    for(let i = array.length - 1; i >=0; i--) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[randIndex];
        array[randIndex] = temp;
    }
    return array;
}