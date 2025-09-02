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


// MILESTON 3

// definisco la type guard function per verificare se un oggetto sconosciuto (unknown) è del tipo specifico Actress (+ Person).

function isActress(dati: unknown): dati is Actress {
    // controllo se questi dati esistono in Actress e che siano
    // del tipo giusto, solo cosi typescript ritornerà true
    return (
        typeof dati === 'object' && dati !== null &&
        'id' in dati && typeof dati.id === 'number' &&
        'name' in dati && typeof dati.name === 'string' &&
        'birth_year' in dati && typeof dati.birth_year === 'number' &&
        'death_year' in dati && typeof dati.death_year === 'number' &&
        'biography' in dati && typeof dati.biography === 'string' &&
        'image' in dati && typeof dati.image === 'string' &&
        'most_famous_movies' in dati && dati.most_famous_movies instanceof Array &&
        dati.most_famous_movies.length === 3 &&
        dati.most_famous_movies.every(m => typeof m === 'string') &&
        'awards' in dati && typeof dati.awards === 'string' &&
        'nationality' in dati && typeof dati.nationality === 'string'
    )
}

// funzione per recuperare i dati delle attrici a partire da un id
async function getActress(id: number): Promise<Actress | null> {
    try {
        const response = await fetch(`http://localhost:3333/actresses${id}`)
        const dati: unknown = await response.json();
        if (!isActress(dati)) {
            throw new Error('Formato dei dati non valido')
        }
        return dati;

    } catch (error) {
        if (error instanceof Error) {
            console.error('errore nel recupero dei dati', error)
        } else {
            console.error('errore sconosciuto', error)
        }
        return null
    }
}


// MILESTON 4

async function getAllActresses(): Promise<Actress[]> {
    try {
        const response = await fetch(`http://localhost:3333/actresses`)
        // verifico se i dati vengono recuperati
        if (!response.ok) {
            throw new Error(`Errore HTTP${response.status}`)
        }
        const dati: unknown = await response.json();
        if (!(dati instanceof Array)) {
            throw new Error('Formato dei dati non valido')
        }
        const datiValidi: Actress[] = dati.filter(isActress)
        return datiValidi;

        // gestione errori
    } catch (error) {
        if (error instanceof Error) {
            console.error('errore nel recupero dei dati delle attrici', error)
        } else {
            console.error('errore sconosciuto', error)
        }
        return [];
    }

}


// MILESTON 5 

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
    try {
        const promises = ids.map(id => getActress(id));
        const attrici = await Promise.all(promises)
        return attrici;

    } catch (error) {
        if (error instanceof Error) {
            console.error('errore nel recupero dei dati delle attrici', error)
        } else {
            console.error('errore sconosciuto', error)
        }
        return [];
    }
}


// MILESTON 6 (BONUS)

// funzione per la creazione di una attrice ma con un id generato casualmente
function createActress(dati: Omit<Actress, 'id'>): Actress {
    return {
        id: Math.floor(Math.random() * 10000),
        ...dati
    }
}

// funzione per modificare i dati di un'attrice ad esclusione di id e name
function updateActress(attrice: Actress, modifiche: Partial<Omit<Actress, 'id' | 'name'>>): Actress {
    return {
        ...attrice, ...modifiche,
        // non ho bisogno di scriverli singolarmente perche ho fatto un Omit di ⬆️ Partial 
        // id: attrice.id,
        // name: attrice.name
    }
}


// MILESTON 7 (BONUS)

type nazioni = 'American' | 'British' | 'Australian' | 'Israeli-American' | 'SouthAfrican' | 'French' | 'Indian' | 'Israeli' | 'Spanish' | 'SouthKorean' | 'Chinese' | 'Scottish' | 'New Zealand' | 'Hon Kong' | 'German' | 'Canadian' | 'Irish'

type Actor = Person & {
    known_for: [string, string, string],
    awards: [string] | [string, string],
    nationality: nazioni
}

// definizione della type guard function per verificare se una variabile di tipo sconosciuto (unknown) corrisponde alla struttura di Person
// (dati is Person: è una type predicate → serve a dire al compilatore TypeScript: "Se questa funzione restituisce true, allora puoi trattare dati come un oggetto di tipo Person.")
function isPerson(dati: unknown): dati is Person {
    return (typeof dati === 'object' && dati !== null &&
        'id' in dati && typeof dati.id === 'number' &&
        'name' in dati && typeof dati.name === 'string' &&
        'birth_year' in dati && typeof dati.birth_year === 'number' &&
        'death_year' in dati && typeof dati.death_year === 'number' &&
        'biography' in dati && typeof dati.biography === 'string' &&
        'image' in dati && typeof dati.image === 'string'
    )
}

// definizione della type guard function che serve a verificare se un oggetto (dati unknown) non solo è una Person, ma anche un Actor
function isActor(dati: unknown): dati is Actor {
    return (
        isPerson(dati) &&
        'most_famous_movies' in dati && dati.most_famous_movies instanceof Array &&
        dati.most_famous_movies.length === 3 &&
        dati.most_famous_movies.every(m => typeof m === 'string') &&

        'awards' in dati && dati.awards instanceof Array &&
        (dati.awards.length === 1 || dati.awards.length === 2) &&
        dati.awards.every(m => typeof m === 'string') &&

        'nationality' in dati && typeof dati.nationality === 'string')
}

async function getActor(id: number): Promise<Actor | null> {
    try {
        const response = await fetch(`http://localhost:3333/actors${id}`)
        const dati: unknown = await response.json();
        if (!isActor(dati)) {
            throw new Error('Formato dei dati non valido')
        }
        return dati;

    } catch (error) {
        if (error instanceof Error) {
            console.error('errore nel recupero dei dati', error)
        } else {
            console.error('errore sconosciuto', error)
        }
        return null
    }
}


async function getAllActors(): Promise<Actor[]> {
    try {
        const response = await fetch(`http://localhost:3333/actors`)
        // verifico se i dati vengono recuperati
        if (!response.ok) {
            throw new Error(`Errore HTTP${response.status}`)
        }
        const dati: unknown = await response.json();
        if (!(dati instanceof Array)) {
            throw new Error('Formato dei dati non valido')
        }
        const datiValidi2: Actor[] = dati.filter(isActor)
        return datiValidi2;

        // gestione errori
    } catch (error) {
        if (error instanceof Error) {
            console.error('errore nel recupero dei dati degli attori', error)
        } else {
            console.error('errore sconosciuto', error)
        }
        return [];
    }

}


async function getActors(ids: number[]): Promise<(Actor | null)[]> {
    try {
        const promises = ids.map(id => getActor(id));
        const attori = await Promise.all(promises)
        return attori;

    } catch (error) {
        if (error instanceof Error) {
            console.error('errore nel recupero dei dati degli attori', error)
        } else {
            console.error('errore sconosciuto', error)
        }
        return [];
    }
}


// funzione per la creazione di una attrice ma con un id generato casualmente
function createActor(dati: Omit<Actor, 'id'>): Actor {
    return {
        id: Math.floor(Math.random() * 10000),
        ...dati
    }
}

// funzione per modificare i dati di un'attrice ad esclusione di id e name
function updateActor(attrice: Actor, modifiche: Partial<Omit<Actor, 'id' | 'name'>>): Actor {
    return {
        ...attrice, ...modifiche,
        // non ho bisogno di scriverli singolarmente perche ho fatto un Omit di ⬆️ Partial 
        // id: attrice.id,
        // name: attrice.name
    }
}