<?php
    ob_start();
?>

<div id="root">
</div>
<script src="scripts/EventEmitter.js"></script>
<script src="scripts/Pokemon.js"></script>
<script src="scripts/PokemonCollection.js"></script>
<script src="scripts/Type.js"></script>
<script src="scripts/TypeCollection.js"></script>
<script src="scripts/PokemonBlock.js"></script>
<script src="scripts/PokemonGrid.js"></script>
<?php
    $content = ob_get_clean();
    include 'template.php';