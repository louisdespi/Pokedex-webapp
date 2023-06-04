<?php
    ob_start();
?>
    <h3>Not found</h3>

<?php
    $content = ob_get_clean();
    include 'template.php';