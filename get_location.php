<?php
include('config.php');
$childname = $_POST['childname'];
$childage = $_POST['childage'];
$thiscountry = $_POST['thiscountry'];
$thiscity = $_POST['thiscity'];
$loc = $_POST['loc'];

$q = mysql_query("INSERT INTO info(childname,childage,thiscountry,thiscity,loc) VALUES('$childname','$childage','$thiscountry','$thiscity','$loc') ");
if($q)
{
    echo "Your data has been inserted successfully";
}
 else 
 {
     echo "Your data doesnot inserted successfully.";
 }

?>