{
    // before
    class HTTPError extends Error {
        status: number;
        constructor(status: number, message: string | undefined = undefined) {
            super(message);
            this.status = status;
        }
    }

    /*
        Most likely, the developer who wrote this had just started using TypeScript and default assignment feature.
        That's why it's really important to know you job well :)
    */
}

{
    // after
    class HTTPError extends Error {
        status: number;
        constructor(status: number, message?: string) {
            super(message);
            this.status = status;
        }
    }

    /*
        In TypeScript, there is much more elegant way to make the variable optional, using question mark before type assignment.
        And don't be superstitious, any variable in JavaScript (superset of which TypeScript is) is `undefined` by default.
    */
}
