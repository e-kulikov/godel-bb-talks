const customer: { dob?: Record<string, any> } = {};

// 1. Object property check
{
    // before
    if (typeof customer.dob !== 'undefined') {
        customer.dob.constructed = new Date().toLocaleDateString();
    }

    // after
    if (customer.dob !== undefined) {
        customer.dob.constructed = new Date().toLocaleDateString();
    }
    /*
        It used to be that `undefined` was a global variable that could be reassigned.
        Nowadays, it's impossible. Don't be superstitious, you shouldn't use bulky constructions with `typeof` checks
    */
}

// 2. Global variable check
{
    // before
    if (typeof customerDoB !== 'undefined') {
        customerDoB = new Date().toLocaleDateString()
    }
    // after
    // there is no "after" for this construction ¯\_(ツ)_/¯, thanks to TypeScript

    /*
        There was a case when we check the value of global variable, that might not be declared, and that causes an error.
        If you are not sure if the global variable exists, it's better check it explicitly (using `if ('varname' in global)`).

        Don't be superstitious, TypeScript highlights cases like this and protects you from accessing non-declared variables.
     */
}
