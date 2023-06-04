<?php

interface DAOInterface {
    public function connect ();
    public function fetch_all ();
    public function fetch ($id);
    public function where ($attr, $value);
    public function first ($attr, $value);
    public function destroy ($id);
    public function store ($obj);
    public function insert ($statement, $data, $obj);
}