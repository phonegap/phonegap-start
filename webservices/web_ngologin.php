<?php

include("config.php");

header("Content-type: text/xml");
    $UserName = $_REQUEST['UserName'];
    $Password = $_REQUEST['Password'];
if(($UserName)&&($Password))
{
$q=mysql_query("SELECT * FROM ngo WHERE username = '$UserName' AND password = '$Password'");
if(mysql_num_rows($q)>0){
$result = mysql_fetch_assoc($q);
    echo "<ngoinformation>";
    echo "<ngo>True</ngo>";
    echo "<ngoid>".$result['id']."</ngoid>";
    echo "</ngoinformation>";
}

else
{
    echo "<ngo>False</ngo>";
}
  
        }
        else {
                echo "<status>Provide Complete Parameters</status>";
          }

?>