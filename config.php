<?php
$server = "localhost";
$database = "education";
$dbuser = "root";
$dbpassword = "";

$link = mysql_connect($server,$dbuser,$dbpassword);
if(!$link){die('Could not connect: '.mysql_error());}

$db_selected = mysql_select_db($database,$link);
if(!$db_selected){die ("Cant use $database : " . mysql_error());}
?>