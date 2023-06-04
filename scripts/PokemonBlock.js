class PokemonBlock extends EventEmitter {
    constructor(pokemon) {
        super()
        this.pokemon = pokemon
    }
    get_dom() {
        return $(`
            <a class="toggle-link ${this.pokemon.owned ? "owned-pokemon" : ""}" id="tl-${this.pokemon.id}" href="?store=true&id=${this.pokemon.id}">
                <div class="pokemon-block" id="sr-${this.pokemon.id}">
                    <span class="id">${this.pokemon.id}</span>
                    <h5 class="name">${this.pokemon.name ?? ""}</h5>
                    <div class="sprite_wrap">
                        <img class="sprite" src="${this.pokemon.sprite_url ?? "#"}">
                    </div>
                </div>
            </a>
        `)
    }
}