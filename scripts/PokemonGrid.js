class FilterManager extends EventEmitter {
    constructor() {
        super()
        this.filters = {}
    }
    add(order, name, display, func) {
        this.filters[name] = {
            order : order,
            display : display,
            name : name,
            func : func,
            enabled : false
        }
    }
    remove(name) {
        if (this.filters[name]) {
            delete(this.filter[name])
            return true
        }
        return false
    }
    get(enabled_only) {
        let ret = []
        for (let filter of Object.values(this.filters)) {
            if ((enabled_only && filter.enabled) || !enabled_only) {
                ret.push(filter)
            }
        }
        if (ret.length > 1) {
            ret.sort((a, b) => { 
                if (a.order < b.order) return -1; // a should come before b
                if (a.order > b.order) return 1; // a should come after b
                return 0; // names are equal
            });
        }
        return ret
    }
}

class FilterMenu extends EventEmitter {
    constructor(parent) {
        super()
        this.fm = new FilterManager()
        this.root = $(`
            <div id="menu-toggle">
                <span class="line1"></span>
                <span class="line2"></span>
                <span class="line3"></span>
            </div>
            <div id="slider">
                <div id="search" class="button">
                    <input type="text"/>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30px" height="30px">
                        <path shape-rendering="geometricPrecision" fill="currentColor" d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"/>
                    </svg>
                </div>
            </div>
        `)
        $('body').on('click', '#menu-toggle',  (e) => {
            e.preventDefault();
            let $target = $(e.currentTarget)
            if ($target.hasClass('animate')){
                $target.removeClass('animate');
                $('#nav-buttons #slider').removeClass('open')
            } else {
                $('#nav-buttons #slider').addClass('open')
                $target.addClass('animate');
            }
        });
        $(parent).append(this.root)
        this.$search_bar = $('#slider #search input')
        $('#slider #search svg').on('click', (e) => {
            e.preventDefault()
            this.trigger('update')
        })
        this.$search_bar.keypress((e) => {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == 13) {
                e.preventDefault();
                this.trigger('update')
            }

        })
        this.slider = $('#nav-buttons #slider')
    }
    set(filters) {
        for (let filter of filters) {
            this.fm.add(filter.order, filter.name, filter.display, filter.func)
        }
        this.update()
    }
    add(filter) {
        this.fm.add(filter.order, filter.name, filter.display, filter.func)
        this.update()
    }
    update() {
        let filters = this.fm.get(false)
        for (let filter of filters) {
            let $button = $(`<div id="filter-${filter.name}" class="button">${filter.display}</div>`)
            this.slider.append($button)
            $button.on('click', (e) => {
                let $target = $(e.currentTarget)
                if (filter.enabled) {
                    if ($target.hasClass('selected')) {
                        $target.removeClass('selected')
                    }
                    filter.enabled = false
                } else {
                    if (!$target.hasClass('selected')) {
                        $target.addClass('selected')
                    }
                    filter.enabled = true
                }
                this.trigger('update', filter)
            })
        }
    }
}

class PokemonGrid extends EventEmitter {
    constructor(parent) {
        super()
        this.collection = new PokemonCollection()
        this.collection.on('loaded', (p) => {
            $('#loading-bar div').css('width', `${Math.round(parseInt(this.collection.get_load_percent()))}%`)
        })
        this.collection.on('loaded-full', () => {
            $('#loading-wrap').addClass('hidden')
        })
        this.root = $(`
            <div id="nav-buttons">
            </div>
            <div id="pokemon-grid">
            </div>
            <div id="pager">
                <div id="pages">
                    <div id="count"></div>
                    <div id="page-buttons">
                        <button class="button" id="previous">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                                <path style="text-indent:0;text-align:center;line-height:normal;text-transform:none;block-progression:tb;-inkscape-font-specification:Bitstream Vera Sans" d="M 16.25 1.34375 L 7.25 11.34375 L 6.65625 12 L 7.25 12.65625 L 16.25 22.65625 L 17.75 21.34375 L 9.34375 12 L 17.75 2.65625 L 16.25 1.34375 z" overflow="visible" font-family="Bitstream Vera Sans" fill="currentColor"/>
                            </svg>
                        </button>
                        <button class="button" id="next">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                                <path style="text-indent:0;text-align:center;line-height:normal;text-transform:none;block-progression:tb;-inkscape-font-specification:Bitstream Vera Sans" d="M 7.75 1.34375 L 6.25 2.65625 L 14.65625 12 L 6.25 21.34375 L 7.75 22.65625 L 16.75 12.65625 L 17.34375 12 L 16.75 11.34375 L 7.75 1.34375 z" overflow="visible" font-family="Bitstream Vera Sans" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div id="loading-wrap">
                <div id="loading-bar">
                    <div></div>
                </div>
            </div>
        `)
        $(parent).append(this.root)
        this.menu = new FilterMenu($('#nav-buttons'))
        this.menu.set([
            {
                order:1,
                name:'favorites',
                display:'Favoris',
                func: (p) => {return p.owned == true}
            },
            {
                order:2,
                name:'legendaries',
                display:'Legendaires',
                func: (p) => {return p.is_legendary == true}
            },
            {
                order:3,
                name:'babies',
                display:'Bébés',
                func: (p) => {return p.is_baby == true}
            }
        ])
        this.menu.on('update', (f) => {
            let filters = this.menu.fm.get(true).map((filter) => {
                return filter.func
            })
            filters.push((p) => {
                return p.name.toLowerCase().includes(this.menu.$search_bar.val().toLowerCase())
            })
            this.search(filters, 0)
        })
        this.$nav = $('#nav-buttons #slider')
        this.$grid = $('#pokemon-grid')
        this.$pager = $('#pager #count')
        this.$pager_prev = $('#pager #previous')
        this.$pager_next = $('#pager #next')
        this.init = false
    }
    initialize() {
        return new Promise((resolve, reject) => {
            if (!this.collection.init) {
                this.collection.initialize()
                .then(() => {
                    this.collection.load_collection()
                    .then(() => {
                        this.init = true
                        resolve()
                    })
                })
                .catch(reject)
            } else {
                resolve()
            }
        })
    }
    search(filters, chunk_index, chunks_length = 40) {
        this.$grid.empty()
        return new Promise((resolve, reject) => {
            this.initialize()
            .then(() => {
                this.collection.get(filters, chunks_length)
                .then((chunks) => {
                    if (chunks[chunk_index]) {
                        for (let pokemon of chunks[chunk_index]) {
                            let block = new PokemonBlock(pokemon)
                            let $d = block.get_dom()
                            this.$grid.append($d)
                            $d.on('click', (e) => {
                                e.preventDefault()
                                return new Promise((resolve, reject) => {
                                    let url = (pokemon.owned) ? `?remove=true&id=${pokemon.id}`  : `?store=true&id=${pokemon.id}` 
                                    $.post(url)
                                    .done((r) => {
                                        resolve(pokemon)
                                    })
                                    .fail((err) => {
                                        reject(err)
                                    })
                                })
                                .then((p) => {
                                    p.update_ownership()
                                    .then((p) => {
                                        let $pokebloc = $(e.currentTarget)
                                        if (p.owned && !$pokebloc.hasClass('owned-pokemon'))
                                            $pokebloc.addClass('owned-pokemon')
                                        if (!p.owned && $pokebloc.hasClass('owned-pokemon'))
                                            $pokebloc.removeClass('owned-pokemon')
                                        //this.search(filters, chunk_index, chunks_length)
                                    })
                                })
                            })
                        }
                    }
                    this.pager(chunks, chunk_index, chunks_length, filters)
                    resolve(chunks)
                })
            })
        }).then((chunks) => {
            console.log(`Search completed with ${chunks.flat().length} result(s)`)
        })
    }
    pager(chunks, chunk_index, chunks_length, filters) {
        this.$pager.empty();    
        for (let i in chunks) {
            if (i == chunk_index) {
                this.$pager.append(`<div class="page current" id="page-${i}"></div>`);                
            } else {
                this.$pager.append(`<div class="page" id="page-${i}"></div>`);
                this.$pager.find(`#page-${i}`).on('click', (e) => {
                    e.preventDefault()
                    this.search(filters, i, chunks_length)
                })
            }
        }
        this.$pager_prev.off('click')
        this.$pager_next.off('click')
        if (chunks.length > 1) {
            if (chunk_index == parseInt(chunk_index) - 1) {
                this.$pager_prev.removeClass('hidden')
                this.$pager_prev.on('click', () => {
                    this.search(filters, parseInt(chunk_index) - 1, chunks_length)
                })
                this.$pager_next.addClass('hidden')
            } else if (chunk_index == 0) {
                this.$pager_prev.addClass('hidden')
                this.$pager_next.removeClass('hidden')
                this.$pager_next.on('click', () => {
                    this.search(filters, parseInt(chunk_index) + 1, chunks_length)
                })
            } else {
                this.$pager_next.removeClass('hidden')
                this.$pager_prev.removeClass('hidden')
                this.$pager_prev.on('click', () => {
                    this.search(filters, parseInt(chunk_index) - 1, chunks_length)
                })
                this.$pager_next.on('click', () => {
                    this.search(filters, parseInt(chunk_index) + 1, chunks_length)
                })
            }
        } else {
            this.$pager_next.addClass('hidden')
            this.$pager_prev.addClass('hidden')
        }
    }
}
let pg

$(document).ready(() => {
    pg = new PokemonGrid($('#root'))
    pg.search([], 0)
    //grid.load_chunk(0)
})