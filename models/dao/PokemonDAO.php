<?php

class PokemonDAO extends DAO {

    public function __construct () {
        parent::__construct("pokemons");
    }
    
    public function store ($pokemon) {
        $statement = $this->db->prepare("INSERT INTO pokemons (iid, name, sprite_url) VALUES (?, ?, ?)");
        return parent::insert($statement, [$pokemon->iid, $pokemon->name, $pokemon->sprite_url], $pokemon);
    }
    
    public function create ($data) {
        if (empty($data["id"])) {
            return false;
        }
        return new Pokemon(
            $data["id"] ?? false,
            $data["iid"] ?? false,
            $data["name"] ?? false,
            $data["sprite_url"] ?? false
        );
    }
}