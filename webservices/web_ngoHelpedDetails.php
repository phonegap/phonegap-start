<?php
include('config.php');
header("Content-type: text/xml");

$query = mysql_query("Select ngo.id,username,count(is_supported) as count from ngo left join users_ngo on ngo.id=ngoid and is_supported=1 group by id");
if((mysql_num_rows($query)) > 0)
{
    echo"<parent_tag>";
while($result = mysql_fetch_assoc($query))
{
    echo "<UserInformation>";
    echo "<username>".$result['username']."</username>";
    echo "<usercount>".$result['count']."</usercount>";
    echo "</UserInformation>";
}
echo "</parent_tag>";
}
else
{
    echo "<status>false</status>";
}

?>