<?php
    ob_start();
?>
<h3><?= $pokemon->name ?></h3>
<span>iid : <?= $pokemon->iid ?></span>
<span>id : <?= $pokemon->id ?></span>
<img src="<?= $pokemon->sprite_url ?>"/>

<?php
    $content = ob_get_clean();
    include 'template.php';