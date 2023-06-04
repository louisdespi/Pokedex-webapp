<?php 
spl_autoload_register ( function ($class) {
	if (strpos ( $class, "DAO") !== false) {
		require_once("models/dao/{$class}.php");
	} else if (strpos ( $class, "Controller") !== false) {
        require_once("controllers/{$class}.php");
    } else {
		require_once("models/entities/{$class}.php");
	}
});
