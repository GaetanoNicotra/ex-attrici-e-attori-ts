// MILESTON 1

type Person = {
    readonly id: number,
    readonly name: string,
    birth_year: number,
    death_year?: number,
    biography: string,
    image: string,
}


// MILESTON 2

type Actress = Person & {
    most_famous_movies: [string, string, string],
    awards: string,
    nationality: 'American' | 'British' | 'Australian' | 'Israeli-American' | 'SouthAfrican' | 'French' | 'Indian' | 'Israeli' | 'Spanish' | 'SouthKorean' | 'Chinese'
}