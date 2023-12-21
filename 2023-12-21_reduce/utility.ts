import { users } from "./stubs";

type User = typeof users[number]

export const sum2Values = (a: number, b: number) => a + b

export const isMoreThan5000 = (num: number) => num > 5000

export const enum GENDER {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}
const isGender = (genderNorm: GENDER) =>
    ({ gender }: User) => gender === genderNorm

export const isMale = isGender(GENDER.MALE)
export const isFemale = isGender(GENDER.FEMALE)

export const getUserGender = (user: User) => isMale(user) ? GENDER.MALE : isFemale(user) ? GENDER.FEMALE : GENDER.OTHER

const isOlderThan = (ageNorm: number) =>
    ({ dob }: User) => dob.age < ageNorm

const enum RETIREMENT_AGE {
    MALE = 65,
    FEMALE = 60
}
export const isRetiredMale = isOlderThan(RETIREMENT_AGE.MALE)
export const isRetiredFemale = isOlderThan(RETIREMENT_AGE.FEMALE)

export const getUserName = ({ name }: User) => `${name.title} ${name.first} ${name.last}`
