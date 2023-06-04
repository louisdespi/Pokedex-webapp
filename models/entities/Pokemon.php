<?php

class Pokemon extends Entity implements JsonSerializable {
    protected $id;
    protected $iid;
    protected $name;
    protected $sprite_url;
    protected static $dao = "PokemonDAO";

    public function __construct ($id, $iid, $name, $sprite_url) {
        $this->id = $id ?? false;
        $this->iid = $iid;
        $this->name = $name;
        $this->sprite_url = $sprite_url;
    }
    
    public function __get ($prop) {
        if (property_exists($this, $prop)) {
            /*if ($prop == "recipes") {
                return $this->recipes();
            }*/
            return $this->$prop;
        }
    }
    
    public function __toString () {
        return "{$this->id} : {$this->name}";
    }

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'iid' => $this->iid,
            'name' => $this->name,
            'sprite_url' => $this->sprite_url
        ];
    }
    
    
    /*public function recipes () {
        return $this->belongsToMany(Recipe::class, "recipes", "ingredient_recipe", "ingredient_id", "recipe_id");
    }*/
    
    /*public function remove ($prop, $recipe = false) {
        if ($prop == "recipes") {
            return $this->unsync("ingredient_recipe", "ingredient_id", "recipe_id", $recipe);
        }
    }*/
    
    /*public function add ($prop, $recipe) {
        if ($prop == "recipes") {
            return $this->sync("ingredient_recipe", "ingredient_id", "recipe_id", $recipe);
        }
    }*/
    
}