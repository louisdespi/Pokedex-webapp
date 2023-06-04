class Type extends EventEmitter{
    constructor(id) {
        super()
        this.id = id
        this.settled = false
    }
    load() {
        return new Promise((resolve, reject) => {
            $.get(`https://pokeapi.co/api/v2/type/${this.id}`)
            .done((r) => {
                this.name = r.name
                for (let translation of r.names) {
                    if (translation.language.name && translation.language.name == 'fr') {
                        this.translation = translation.name
                        break
                    }
                }
                resolve(this)
            })
            .fail((err) => {
                reject(err)
            })
        })
    }
}