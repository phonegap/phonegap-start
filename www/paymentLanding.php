<?php
$queryString = '';
foreach ($_POST as $name => $value) {
    $queryString .= $name.'='.$value.'&';
}
header('location: http://karafone-app.dev/#/'.$_GET['service'].'/requestResult?'.$queryString);
exit();
