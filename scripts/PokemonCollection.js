class PokemonCollection extends EventEmitter {
    constructor() {
        super()
        this.collection = []
        this.init = false
    }
    initialize() {
        return new Promise((resolve, reject) => {
            $.get(`https://pokeapi.co/api/v2/pokemon`)
            .done((r) => {
                for (let i = 1; i <= 1010/*r.count*/; i++) {
                    this.collection.push(new Pokemon(i))
                }
                this.init = true
                resolve(r)
            })
            .fail((err) => {
                reject(err)
            })
        })
    }
    load_collection(chunk_length = 200) {
        let pokemons = this.collection.filter((pokemon) => {
            return pokemon.loaded == false;
        });
      
        let chunks = PokemonCollection._chunkify(pokemons, chunk_length);
        let promiseChain = Promise.resolve([]);
      
        // Process the chunks sequentially
        chunks.forEach((chunk) => {
            promiseChain = promiseChain.then((results) => {
                const promises = chunk.map((pokemon) => {
                    return new Promise((resolve, reject) => {
                        pokemon
                        .load()
                        .then(() => {
                            pokemon.settled = true
                            this.trigger('loaded', pokemon)
                            console.log(`successfully loaded pokemon of id ${pokemon.id}`);
                            resolve(pokemon);
                        })
                        .catch(() => {
                            pokemon.settled = true
                            console.error('Error attempting to load id:', pokemon.id);
                            resolve(null);
                        });
                    });
                });
                return Promise.allSettled(promises)
            });
        });
        return promiseChain.then(() => {
            this.trigger('loaded-full')
        })
    }
    get_load_percent() {
        let loaded = this.collection.filter(p => p.settled).length
        let notloaded = this.collection.filter(p => !p.settled).length
        let total = this.collection.length
        return (loaded/total) * 100
    }
    get(filters, chunk_length) {
        return new Promise((resolve) => {
            this.load_collection()
                .then(() => {
                    let pokemons = []
                    for (let pokemon of this.collection) {
                        if (pokemon.loaded) {
                            pokemons.push(pokemon)
                        }
                    }
                    for (let filter of filters) {
                        pokemons = pokemons.filter(filter)
                    }
                    resolve(PokemonCollection._chunkify(pokemons, chunk_length))
                })
        })
    }
    static _chunkify(collection, chunk_length = 40) {
        let chunks = [];
        let index = 0;
        while (index < collection.length) {
            chunks.push(collection.slice(index, index + chunk_length));
            index += chunk_length;
        }
        return chunks
    }
}