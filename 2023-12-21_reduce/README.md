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
[].reduce(callbackFn, initialValue);
```
Let's start from the end:
- `initialValue` - the value, from which the folding should start. If omitted, the first element of the iterable; in that case the iteration will start from the second value of the original iterable.
- `callbackFn(accum, item, index, arr)` - the callback function, that is called on each element in an array. This function itself accepts [4 arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#parameters), but in this particular case we need to handle just the first 2:
  - `accum` - the result of the previous iteration, or the initial value on the first iteration;
  - `item` - the item of the current iteration.

So, describing in details each iteration `.reduce` does for us in the previous example, it would look like the following code:
```js
const numbers = [1, 2, 3, 4]

// const result = numbers.reduce(sumWithSecondSquare, 0);

const first = sumWithSecondSquare(0, numbers[0]);
const second = sumWithSecondSquare(first, numbers[1]);
const third = sumWithSecondSquare(second, numbers[2]);
const fourth = sumWithSecondSquare(third, numbers[3]);

console.log('result', fourth); 
```

I'm not a fan of one-liners, but I believe nobody would iterate arrays manually.

## 2. Folding with conditions
Sometimes we need to fold an array, omitting some values from it by any condition. We don't want to use bulky approach from the previous example with an additional value, so we filter an array first, keeping only suitable values, and then fold it. But it requires an additional variable, that keeps that additional values, again:
```js
const numbers = [1, 2, 3, 4];
const isEven = (num) => num % 2 === 0;

const evenNumbers = numbers.filter(isEven);

const result = evenNumbers.reduce(sumWithSecondSquare, 0);
console.log('result', result); 
```

As I said, it requires an additional variable again, but it that case we have to iterate the array twice: firstly, to filter values, and then to perform a folding operation. We can do that just with the only loop, checking values just inside reduce callback:
```js
const numbers = [1, 2, 3, 4];
const isEven = (num) => num % 2 === 0;

const sumOnlyEvenSquares = (prev, next) => {
  if (!isEven(num)) return sumOfSquares;
  return sumWithSecondSquare(sumOfSquares, num);
}

const result = numbers.reduce(sumOnlyEvenSquares, 0);
console.log('result', result);
```
In this case, a callback looks not so elegant, but we omit extra iteration here, optimizing our code.

## 3. Grouping elements of an array
Let's assume, we need to group elements in the array by a few conditions:
```js
const numbers = [1, 2, 3, 4];
const isEven = (num) => num % 2 === 0;
const isOdd = (num) => !isEven(num);

const evens = numbers.filter(isEven);
const odds = numbers.filter(isOdd);

console.log('evens', evens);
console.log('odds', odds);
```

Here we again have to iterate an array twice, filtering the original array for required numbers. And as many groups we need, as many iterations we need to perform.
But using some additional JS features, as destructuring, and applying them together with `reduce()`, we can do the only iteration:
```js
const numbers = [1, 2, 3, 4];
const isEven = (num) => num % 2 === 0;
const isOdd = (num) => !isEven(num);

const { evens, odds } = numbers.reduce((groups, num) => {
    if (isEven(num)) groups.evens.push(num);
    if (isOdd(num)) groups.odds.push(num);
    return groups;
}, { evens: [], odds: [] });

console.log('evens', evens);
console.log('odds', odds);
```

That's it. We did the only iteration to group the elements of the array in groups. And the amount of groups doesn't affect the amount of iterations.
Actually, upcoming ES2024 standard can optimize this code even more using [`Objec.groupBy()` static method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy).

## 4. Function composition
While some adepts of functional style still waiting for pipeline operator support in EcmaScript standard, we can emulate this using `reduce()`.

Let's assume, we have an array of users with the only date of birth field in there. To calculate the average age of our application user, we need to detect the age of each customer, and only then we are able to calculate the value of average age.
```js
const users = [
  { /* other user's data */ dob: '1990-12-22' },
  { /* other user's data */ dob: '1973-11-02' },
  { /* other user's data */ dob: '2000-03-14' }
];

const makeDate = (dateString) => new Date(dateString);
// for the sake of simplicity, it's better use libraries like `date-fns` or similar
const fullYearsFromNow = (date) => new Date().getFullYear() - date.getFullYear();
const sumTwoValues = (a, b) => a + b;

const dobs = users.map(user => makeDate(age.dob));
const ages = dobs.map(fullYearsFromNow);
const averageAge = ages.reduce(sumTwoValues, 0) / ages.length;

console.log('result', averageAge);
```

Arr, how many iterations, let's optimise the code in favour to performance:
```js
// all utility functions are the same
const averageAge = users.reduce((sumOfAges, user) => {
    return sumTwoValues(sumOfAges, fullYearsFromNow(makeDate(user.dob)));
}, 0) / users.length;

console.log('result', averageAge);
```

We did a function composition, but by hand. Now, let's create `pipe()` function, that does it for us:
```js
const compose = (...fns) => {
    return (input) => {
        fns.reduce((prevResult, fn) => fn(prevResult), input);
    }
}

const getDobFromUser = (user) => user.dob;

const getUsersAges = pipe(getDobFromUser, makeDate, fullYearsFromNow);
const averageAge = users.reduce((sumOfAges, user) => {
    return sumOfAges + getUsersAges(user);
}, 0) / users.length;

console.log('result', averageAge);
```
