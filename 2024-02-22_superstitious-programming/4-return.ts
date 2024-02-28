type MiddlewareFunction = (req: Record<string, any>, res: unknown, next: (a?: Error) => void) => void;
class UnauthorizedError extends Error {}
declare function validateToken(token: string): Promise<boolean>;

{
    // before
    const authenticate : MiddlewareFunction = async (req, res, next) => {
        try {
            const isValid = await validateToken(req.headers.Authorization);
            return isValid ? next() : next(new Error('401'));
        } catch (err: any) {
            return next(new UnauthorizedError(err.message));
        }
    };

    /*
        Not a big problem, of course. But as much code you write, as many problems you'll have in the future, during refactoring.
     */
}

{
    // after
    const authenticate : MiddlewareFunction = async (req, res, next)  => {
        try {
            const isValid = await validateToken(req.headers.Authorization);
            !isValid && next(new Error('401'));
        } catch (err: any) {
            next(new UnauthorizedError(err.message));
        }
    };

    /*
        If you declare that a function doesn't return anything (void), it's better not to use `return` inside,
        especially if you are not going to use `early return` pattern (that is not the case here).

        Don't be superstitious, express doesn't require calling `next()` explicitly.
        You need to do that only when you want to call the next middleware by condition as an early return case,
        or if you want to call error handler middleware.
    */
}
