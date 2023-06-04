<?php 

class PokemonController {
    
    public function index ($as_json) {
        $pokemons = Pokemon::all();
        if ($as_json) {
            echo json_encode($pokemons);
            return ;
        }
        return include 'views/pokemons/list.php';
    }
    
    public function show ($id, $as_json) {
        $pokemon = Pokemon::first('iid', $id);
        if ($pokemon) {
            if ($as_json) {
                echo json_encode($pokemon);
                return ;
            }
            return include 'views/pokemons/one.php';
        }
        if ($as_json) {
            echo json_encode(false);
            return ;
        }
        return include 'views/pokemons/not-found.php';
    }
    
    public function store ($id) {
        $pokemon_bdd = Pokemon::first('iid', $id);
        if ($pokemon_bdd != false) {
            echo json_encode(array(
                'function' => 'store',
                'result' => false,
                'pokemon_iid' =>  $id
            ));
            return false;
        }
        $query = file_get_contents('https://pokeapi.co/api/v2/pokemon/'.$id);
        $pokemon = json_decode($query);
        $name = $pokemon->name;
        $sprite = $pokemon->sprites->front_default;
        $query = file_get_contents($pokemon->species->url);
        $specie = json_decode($query);
        foreach ($specie->names as $translation) {
            if ($translation->language->name == 'fr') {
                $name = $translation->name;
                break;
            }
        }
        $new_pokemon = new Pokemon(false, $pokemon->id, $name, $sprite);
        $new_pokemon->save();
        echo json_encode(array(
            'function' => 'store',
            'result' => true,
            'pokemon_iid' => $id
        ));
        return true;
    }

    public function json_list() {
        $pokemons = Pokemon::all();
        echo json_encode($pokemons);
    }

    public function remove ($id) {
        $pokemon = Pokemon::first('iid', $id);
        if ($pokemon) {
            echo json_encode(array(
                'function' => 'remove',
                'result' => true,
                'pokemon_iid' =>  $id
            ));
            $pokemon->delete();
            return true;
        }
        echo json_encode(array(
            'function' => 'remove',
            'result' => false,
            'pokemon_iid' =>  $id
        ));
        return false;
    }
}