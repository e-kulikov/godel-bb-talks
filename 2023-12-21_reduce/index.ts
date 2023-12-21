import { numbers, users } from "./stubs";

import {
    GENDER,
    getUserGender,
    getUserName,
    isFemale,
    isMale,
    isMoreThan5000,
    isRetiredFemale,
    isRetiredMale,
    sum2Values
} from "./utility";
import { every, pipe, some } from "./fp";
import { differenceInYears } from "date-fns";

{
    console.group('Using .reduce() instead of extra variable:')

    // creating a new variable that we are going to use as an accumulator
    let result = 0
    // looping through an array, doing the reduce job manually
    numbers.forEach((number) => result = sum2Values(result, number))

    console.log('== all values sum, without reduce ==', result)

    // doing the same using .reduce()
    console.log('== all values sum, reduce solution ==', numbers.reduce(sum2Values))

    console.groupEnd()
}

{
    console.group('Using .reduce() to reduce the amount of iterations')

    // Now we know how to omit an extra variable, so we are using .reduce() on filtered array
    console.log('== filtered values sum, 2 iterations ==', numbers.filter(isMoreThan5000).reduce(sum2Values))

    // But we reduce the amount of iterations through an array, using predicate inside reduce callback
    console.log(
        '== filtered values sum, 1 iteration ==',
        numbers.reduce((result, num) => {
            if (!isMoreThan5000(num)) return result
            return sum2Values(result, num)
        })
    )

    console.groupEnd()
}

{
    console.group('Using .reduce() on array of objects to make complicated manipulations')

    // When you need filter, split and modify an array of objects by some attribute
    // you'd probably use a complex structure with an amount of iterations over an array
    console.log(
        '== retired males amount ==',
        users.filter(isMale).filter(isRetiredMale).map(getUserName).length
    )
    console.log(
        '== retired females amount ==',
        users.filter(isFemale).filter(isRetiredFemale).map(getUserName).length
    )

    // Of course, we can apply .reduce() to reduce the amount of iterations
    console.log(
        '== retired males amount, using reduce ==',
        users.reduce((retiredMaleNames, user) => {
            if (!isMale(user) || !isRetiredMale(user)) return retiredMaleNames
            return retiredMaleNames.concat(getUserName(user))
        }, [] as string[]).length
    )
    console.log(
        '== retired females amount, using reduce ==',
        users.reduce((retiredFemaleNames, user) => {
            if (!isFemale(user) || !isRetiredFemale(user)) return retiredFemaleNames
            return retiredFemaleNames.concat(getUserName(user))
        }, [] as string[]).length
    )

    // But there are still 2 iterations to split the initial array, separately for males and females
    // We can optimize it using reduce
    const { male, female } = users.reduce((retiredUsers, user) => {
        if (isMale(user) && !isRetiredMale(user)) return retiredUsers
        if (isFemale(user) && !isRetiredFemale(user)) return retiredUsers

        // Because we assume the list of users is big, it's better apply some optimizations.
        // But we have to break best practice of implementing pure functions
        // It's not a big deal in this case,
        // because we are going to mutate initial value, that is defined inline way in the second argument of .reduce(), so the original users list is untouched
        const gender = getUserGender(user)

        retiredUsers[gender].push(getUserName(user))

        return retiredUsers
    }, { male: [], female: [], other: [] } as Record<GENDER, string[]>)

    console.log('== retired males amount, using reduce and destructuring ==', male.length)
    console.log('== retired females amount, using reduce and destructuring ==', female.length)

    console.groupEnd()
}

{
    console.group('Using .reduce() for function composition')

    // We can use .reduce() for functional programming pattern called "function composition".
    // Let's imagine, in our users list we don't have field "age", but still have their date of birth
    const usersList = users.map(user => ({
        ...user,
        dob: user.dob.date
    }))
    // And now we need to calculate average age of our users
    // Please, take a look in the implementation of pipe() function in 'fp' module
    const makeDateObject = (dateString: string) => new Date(dateString)
    const getYearsFromNow = (date: Date) => differenceInYears(new Date(), date)

    type User = typeof usersList[number]
    const getUserAge = ({ dob }: User): number => pipe(makeDateObject, getYearsFromNow)(dob)

    console.log(
        '== the average user\'s age ==',
        usersList.reduce(
            (sumOfAges, user) =>
                sum2Values(sumOfAges, getUserAge(user)),
            0
        ) / usersList.length
    )

    console.groupEnd()
}

{
    console.group('Beyond .reduce()')

    // Functional programming style allows us to write the code in "meta-programming" way
    // Other words, you can understand what any function does by its name

    // The easier function you create, the easier it is to test it
    // The less code you write, the fewer abilities you have to make mistake in your code
    // The most important thing: you need to name you functions as descriptive, as possible

    // Please, take a look on implementation of every() and some() in 'fp' module
    const isMaleAndRetired = every(isMale, isRetiredMale)
    const isFemaleAndRetired = every(isFemale, isRetiredFemale)
    const isRetiredUser = some(isMaleAndRetired, isFemaleAndRetired)

    console.log('== retired users amount, using composition ==', users.filter(isRetiredUser).length)

    console.groupEnd()
}
