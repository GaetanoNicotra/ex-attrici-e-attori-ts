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