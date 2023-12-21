type PipelineCallback = (x: any) => any

export const pipe = (...fns: PipelineCallback[]) =>
    (argument: any) =>
        fns.reduce((result, fn) => fn(result), argument)

export const compose = (...fns: PipelineCallback[]) =>
    (argument: any) =>
        fns.reduceRight((result, fn) => fn(result), argument)

type PredicateCallback = (x: any) => boolean
export const every = (...fns: PredicateCallback[]) =>
    (argument: any) =>
        fns.every(fn => fn(argument))

export const some = (...fns: PredicateCallback[]) =>
    (argument: any) =>
        fns.some(fn => fn(argument))
