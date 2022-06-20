<?php
$fname = $_GET['folder'];
$glob = glob($fname);
foreach($glob as $file) {
    echo $file . ',';
}
?>
