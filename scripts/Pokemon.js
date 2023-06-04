class Pokemon extends EventEmitter {
    constructor(id) {
        super()
        this.id = id
        this.name = undefined
        this.translations = {}
        this.sprite_url = undefined
        this.is_legendary = undefined
        this.owned = false
        this.loaded = false
        this.settled = false
    }
    update_ownership() {
        return new Promise((resolve, reject) => {
            $.get(`?show=true&id=${this.id}&json=true`)
            .done((r) => {
                r = JSON.parse(r)
                if (r == false) {
                    if (this.owned == true) {
                        this.owned = false
                    }
                } else {
                    if (this.owned == false) {
                        this.owned = true
                    }
                }
                resolve(this)
            })
            .fail((err) => {
                reject(err)
            })
        })
    }
    load() {
        return new Promise((resolve, reject) => {
            $.get(`https://pokeapi.co/api/v2/pokemon/${this.id}`)
            .done((r) => {
                this.name = r.name
                this.sprite_url = r.sprites.front_default
                this.stats = {}
                for (let stat of r.stats) {
                    this.stats[stat.stat.name] = stat.base_stat
                }
                this.types = []
                for (let type of r.types) {
                    this.types.push(type.type.name)
                }
                $.get(r.species.url)
                .done((s) => {
                    for (let trans of s.names) {
                        this.translations[trans.language.name] = trans.name
                    }
                    if (this.translations['fr'])
                        this.name = this.translations['fr']
                    this.is_legendary = s.is_legendary
                    this.is_baby = s.is_baby
                    this.update_ownership()
                    .then(() => {
                        resolve(this)
                    })
                    .catch((err) => {
                        reject(err)
                    })
                    this.loaded = true
                })
                .fail((err) => {
                    reject(err)
                })
            })
            .fail((err) => {
                reject(err)
            })
        })
    }
}