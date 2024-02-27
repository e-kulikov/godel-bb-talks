declare function saveQuotes(quotes: any): void;

// before
{
    const doQuotes = async () =>
        fetch('http://localhost:3000')
            .then((quotes) => {
                saveQuotes(quotes)
            })
            .catch((err) => {
                throw new Error(err);
            });

    // When I see code like this, I imagine a developer who thinks "I bet I can throw the error much further than `fetch` does"
}

// after
{
    const doQuotes = async () =>
        fetch('http://localhost:3000')
            .then((quotes) => {
                saveQuotes(quotes)
            })

    /*
        Don't be superstitious, if you are not going to process the error somehow (log, enrich or trace it), don't catch-throw error
    */
}
