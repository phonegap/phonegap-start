<?php
include_once('config.php');
header("Content-type: text/xml");

$query = mysql_query("SELECT * FROM ngo");
if((mysql_num_rows($query)) > 0)
{
    echo"<parent_tag>";
while($result = mysql_fetch_assoc($query))
{
    echo "<NgoInformation>";
    echo "<ngoid>".$result['id']."</ngoid>";
    echo "<name>".$result['username']."</name>";
    echo "<address>".$result['address']."</address>";
    echo "<mobile_no>".$result['mobile_no']."</mobile_no>";
    echo "<telephone_no>".$result['telephone_no']."</telephone_no>";
    echo "<description>".$result['description']."</description>";
    echo "<motive>".$result['motive']."</motive>";
    echo "<location>".$result['location']."</location>";
    echo "<area_work>".$result['area_work']."</area_work>";

    echo "</NgoInformation>";
}
echo "</parent_tag>";
}
else
{
    echo "<status>false</status>";
}
?>