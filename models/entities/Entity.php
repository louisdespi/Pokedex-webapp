<?php 

abstract class Entity {
    public function __get ($prop) {
        if (property_exists($this, $prop)) {
            return $this->$prop;
        }
    }
    
    public function __set ($prop, $value) {
        if (property_exists($this, $prop)) {
            $this->$prop = $value;
        }
    }
    
    public function save () {
        /*if ($this->id) {
            return (new static::$dao)->update($this);
        }*/
        return (new static::$dao)->store($this);
    }
    
    public function delete () {
        return (new static::$dao)->destroy($this->id);
    }
    
    public static function all () {
        return (new static::$dao)->fetch_all();
    }
    
    public static function find ($id) {
        return (new static::$dao)->fetch($id);
    }
    
    public static function where ($attr, $value) {
        return (new static::$dao)->where($attr, $value);
    }
    
    public static function first ($attr, $value) {
        return (new static::$dao)->first($attr, $value);
    }
    
    public function belongsTo ($class, $prop) {
        if (!$this->$prop instanceof $class) {
            $this->$prop = $class::first('id', $this->$prop);
        }
        return $this->$prop;
    }
    
    public function hasMany ($class, $prop, $name) {
        if (!$this->$prop) {
            $this->$prop = $class::where($name, $this->id);
        }
        return $this->$prop;
    }
    
    public function belongsToMany($class, $prop, $table, $key, $foreign) {
        if (!$this->$prop) {
            $this->$prop = $class::intermediate($table, $key, $this->id, $foreign);
        }
        return $this->$prop;
    }
    
    public static function intermediate($table, $key, $value, $foreign) {
        return (new static::$dao)->intermediate($table, $key, $value, $foreign);
    }
    
    public function associate ($obj, $prop) {
        $obj->$prop = $this;
        $obj->save();
        return $obj;
    }
    
    public function sync ($table, $key, $foreign_key, $foreign) {
        return (new static::$dao)->sync($table, $key, $foreign_key, $this, $foreign); 
    }
    
    public function unsync ($table, $key, $foreign_key, $foreign) {
        return (new static::$dao)->unsync($table, $key, $foreign_key, $this, $foreign); 
    }
}