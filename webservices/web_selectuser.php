<?php
include_once('config.php');
header("Content-type: text/xml");

$query = mysql_query("SELECT DISTINCT users.* FROM users Right JOIN users_ngo ON users.id NOT In(SELECT users_ngo.uid from users_ngo)");

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
?>