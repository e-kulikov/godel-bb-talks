type MiddlewareFunction = (req: Record<string, any>, res: unknown, next: (a: any) => void) => void;
declare function isTokenValid(token: any): Promise<boolean>
export const authenticate : MiddlewareFunction = (req, res, next) : void => {
    try {
        const isValid = await isTokenValid(req.headers.Authorization);
        !isValid && next(new Error(401));
    } catch (err) {
        next(new UnauthorizedError(err.message));
    }
};
