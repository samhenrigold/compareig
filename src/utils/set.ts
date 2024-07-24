export function setDifference<T>(setA: Set<T>, setB: Set<T>): T[] {
    return [...setA].filter(x => !setB.has(x));
}

export function setIntersection<T>(setA: Set<T>, setB: Set<T>): T[] {
    return [...setA].filter(x => setB.has(x));
}