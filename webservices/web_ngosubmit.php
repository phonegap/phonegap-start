<?php
include('config.php');
header("Content-type: text/xml");
$uid = $_REQUEST['uid'];
$ngoid = $_REQUEST['ngoid'];
$status = $_REQUEST['status'];

if(($uid)&&($ngoid)&&($status))
{
    if($status==1)
    {
        $query = mysql_query("INSERT INTO users_ngo(uid,ngoid,is_progress,is_supported) VALUES('$uid','$ngoid',1,0) ");
         if($query)
            {
                echo "<status>True</status>";               
            }
            else
                {
                echo "<status>False</status>";
                }
    }
 else {
        $query = mysql_query("UPDATE users_ngo SET is_supported=1,is_progress=0 WHERE uid='$uid' AND ngoid='$ngoid' ");
         if($query)
            {
                echo "<status>True</status>";               
            }
            else
                {
                echo "<status>False</status>";
                } 
    }
}
 else {
    echo "<status>Provide Complete Parameters</status>";
}


?>