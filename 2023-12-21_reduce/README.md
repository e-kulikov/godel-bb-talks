# How I Learned to Stop Worrying and Love the Array's reduce() method

Array's reduce method is surrounded by an aura of misunderstanding. Lots of people afraid of using it in their code. There is even ESLint rule that forbids using `reduce()` method because by these developer's view it causes much more mess than form and unjustifiably complicates the code.

But is it truth? I'd say "yes" if you don't have an understanding of how .reduce() works, so you have no clue of how to read the code that uses this method. But it's the same for any other method! Some of you, who has been coding in JS long enough can remember the time when .map() was introduced. Some of your colleges used it instead of .forEach() with absolutely the same approach. The code still works, but it's wrong, isn't it? Thinking like that, the only thing we need is just `for...` loop, we can implement all other methods using it. All these build-in methods were introduced for code clearance in some most used cases, and .reduce() isn't an exception.

Below you can find some most often cases when .reduce() can bring improvement in your code, either from performance view or simply clean up your code from bulky procedures.

## 1. Folding
Let's assume we have a list of values and some function, that does some manipulation on 2 values, allowing us to fold this list into the only value.

```js
const numbers = [1, 2, 3, 4];

function sumWithSecondSquare(a, b) {
    return a + b**2;
}
```

To fold some list into the only value, we usually add a value that keeps middle and final results and use normal loop, mutating this middleware result value on each turn: 

```js
let sumOfSquares = 0
numbers.forEach((number) => {
    result = sumWithSecondSquare(sumOfSquares, number)
});
console.log('result', result);
```

As you can probably see, above we did the exact work of .reduce() method, but manually. It's how simple .reduce()'s polyfill could look like. Here is how the same task can be done using .reduce():

```js
const result = numbers.reduce(sumWithSecondSquare, 0);
console.log('result', result);
```

Much clearer, isn't it? It's such clear that you are probably thinking "What the hell it's doing here?". Don't worry and let's look at .reduce()'s arguments:

```js
reduce(callbackFn, initialValue);
```

- ``
