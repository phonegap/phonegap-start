<?php
$server = "mysql2.000webhost.com";
$database = "a7281327_ouztemp";
$dbuser = "a7281327_ouztemp";
$dbpassword = "dcs_ouzel";


$link = mysql_connect($server,$dbuser,$dbpassword);
if(!$link){die('Could not connect: '.mysql_error());}

$db_selected = mysql_select_db($database,$link);
if(!$db_selected){die ("Cant use $database : " . mysql_error());}
?>