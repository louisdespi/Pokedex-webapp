<?php

require('autoload.php');

$controller = new PokemonController();
if (!empty($_GET["store"])) {
    if (!empty($_GET["id"])) {
        $controller->store($_GET["id"]);
    }
} else if (!empty($_GET["show"])) {
    if (!empty($_GET["id"])) {
        if (!empty($_GET['json']))
            $controller->show($_GET["id"], true);
        else
            $controller->show($_GET["id"], false);
    }
} else if (!empty($_GET["remove"])) {
    if (!empty($_GET["id"])) {
        $controller->remove($_GET["id"]);
    }
} else {
    if (!empty($_GET['json']))
        $controller->index(true);
    else
        $controller->index(false);
}