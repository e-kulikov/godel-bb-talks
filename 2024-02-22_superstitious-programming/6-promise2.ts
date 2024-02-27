const data = [0, 1, 2, 3];

function getAsyncData(key): Promise<{}> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data[key]);
        }, 1000)
    })
}

await getAsyncData(0)
