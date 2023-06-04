class TypeCollection extends EventEmitter {
    constructor() {
        super()
        this.collection = []
        this.init = false
    }
    initialize() {
        return new Promise((resolve, reject) => {
            $.get(`https://pokeapi.co/api/v2/type`)
            .done((r) => {
                for (let i = 1; i <= 18; i++) {
                    this.collection.push(new Type(i))
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
        let types = this.collection.filter((type) => {
            return type.settled == false;
        });
      
        let chunks = TypeCollection._chunkify(types, chunk_length);
        let promiseChain = Promise.resolve([]);
      
        // Process the chunks sequentially
        chunks.forEach((chunk) => {
            promiseChain = promiseChain.then((results) => {
                const promises = chunk.map((type) => {
                    return new Promise((resolve, reject) => {
                        type
                        .load()
                        .then(() => {
                            type.settled = true
                            this.trigger('loaded', type)
                            console.log(`successfully loaded type of id ${type.id}`);
                            resolve(type);
                        })
                        .catch(() => {
                            type.settled = true
                            console.error(`Error attempting to load type of id ${type.id}`);
                            resolve(null);
                        });
                    });
                });
                return Promise.allSettled(promises)
            });
        });
        return promiseChain.then((r) => {
            this.trigger('loaded-full')
        })
    }
    get_load_percent() {
        let loaded = this.collection.filter(p => p.settled).length
        let notloaded = this.collection.filter(p => !p.settled).length
        let total = this.collection.length
        return (loaded/total) * 100
    }
    get(chunk_length) {
        return new Promise((resolve) => {
            new Promise((sub_resolve) => {
                if (!this.init) {
                    this.initialize()
                    .then(() => {
                        sub_resolve()
                    })
                } else {
                    sub_resolve()
                }
            })
            .then(() => {
                this.load_collection()
                .then(() => {
                    let types = []
                    for (let type of this.collection) {
                        types.push(type)
                    }
                    resolve(TypeCollection._chunkify(types, chunk_length))
                })
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