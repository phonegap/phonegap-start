<?php
include('config.php');
header("Content-type: text/xml");
$status = $_REQUEST['status'];
$ngoid = $_REQUEST['ngoid'];
if($status)
{
if(($status==1))
{
$query = mysql_query("SELECT DISTINCT users.* FROM users INNER JOIN users_ngo ON users.id=users_ngo.uid AND users_ngo.is_progress=1 AND users_ngo.ngoid='$ngoid'");
if((mysql_num_rows($query)) > 0)
{
    echo"<parent_tag>";
while($result = mysql_fetch_assoc($query))
{
    echo "<UserInformation>";
    echo "<userid>".$result['id']."</userid>";
    echo "<name>".$result['name']."</name>";
    echo "<age>".$result['age']."</age>";
    echo "<city>".$result['city']."</city>";
    echo "<address>".$result['address']."</address>";
    echo "<wishes>".$result['wishes']."</wishes>";
    echo "<reason>".$result['reason']."</reason>";
    echo "</UserInformation>";
}
echo "</parent_tag>";
}
else
{
    echo "<status>false</status>";
}

    
}
else
{
    $query = mysql_query("SELECT DISTINCT users.* FROM users INNER JOIN users_ngo ON users.id=users_ngo.uid AND users_ngo.is_supported=1 AND users_ngo.ngoid='$ngoid'");
if((mysql_num_rows($query)) > 0)
{
    echo"<parent_tag>";
while($result = mysql_fetch_assoc($query))
{
    echo "<UserInformation>";
    echo "<userid>".$result['id']."</userid>";
    echo "<name>".$result['name']."</name>";
    echo "<age>".$result['age']."</age>";
    echo "<city>".$result['city']."</city>";
    echo "<address>".$result['address']."</address>";
    echo "<wishes>".$result['wishes']."</wishes>";
    echo "<reason>".$result['reason']."</reason>";
    echo "</UserInformation>";
}
echo "</parent_tag>";
}
else
{
    echo "<status>false</status>";
}
}
}
else {
                echo "<status>Provide Status</status>";
          }
?>