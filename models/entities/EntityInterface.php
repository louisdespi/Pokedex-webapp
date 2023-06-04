<?php

interface EntityInterface {
    public function __get($attr);
    public function __set($attr, $value);
    public static function all();
    public static function find($id);
}