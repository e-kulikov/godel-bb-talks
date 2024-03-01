declare interface Queue extends Record<string, any> {
    read(): Promise<unknown>
}
declare const queues: Record<string, Queue>

// before
{
    const readFromQueue = async (queueName: string) => {
        try {
            const data = await queues[queueName].read();
            return Promise.resolve(data);
        } catch (err) {
            console.error(err);
        }
    }

    /*
        My favourite so far.

        When you declare an async function, you can think that everything inside the function is wrapped already inside a big promise.
        Don't be superstitious, no need to return resolved promise from async function, when you want to return something.

        You could think, that it means that now return value of the function is `Promise<Promise<any>>`, and you meant to do that,
            but because to monad-based nature of Promises, it would be unfolded anyway into Promise<any>.
    */
}

// after (option 1, full equivalent)
{
    const readFromQueue = async (queueName: string) => {
        try {
            return await queues[queueName].read();
        } catch (err) {
            console.error(err);
        }
    }

    // This is the full equivalent of the previous implementation, but without extra overhead unnecessary Promise.resolve()
}

// after (option 2, no error handler)
{
    /*
        The previous implementation allows you to handle error on this low level.
        If you have some top-level error handler, you can simplify the function even more.
    */
    const readFromQueue = (queueName: string) => queues[queueName].read();

    /*
        As you can see, I've even omitted async in function declaration.

        It's because you don't need it: async means nothing but the function returns a promise,
            but queue.read() itself returns a promise already.

        If you declare the function as async, it'd be again Promise<Promise<unknown>>,
            and as we already know, it's unfolded into simple Promise<unknown>.
     */
}

// after (option 3, one-liner with error handling)
{
    /*
        If you like one-liners, but want to keep error-handling inside the function, you can write it this way
    */
    const readFromQueue = (queueName: string) => queues[queueName].read().catch(console.error)
}
