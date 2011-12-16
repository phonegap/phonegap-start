<?php
include_once('config.php');

        header("Content-type: text/xml");
      
                $username = $_REQUEST['ngoName'];
                $password = $_REQUEST['ngoPass'];
				$description = $_REQUEST['ngoDescription'];
				$motive = $_REQUEST['ngoMotive'];
				$location = $_REQUEST['ngoLocation'];
				$area_work = $_REQUEST['ngoArea'];
				$image = $_REQUEST['ngoImage'];
				$website = $_REQUEST['ngoWebsite'];

				
         if($username && $password && $description && $motive && $location && $image && $website && $area_work)
         {
            $q = mysql_query("INSERT INTO ngo(username,password,description,motive,location,area_Work,image,website) VALUES('$username','$password','$description','$motive','$location','$area_work','$image','$website')");
            if($q)
            {
                echo "<status>True</status>";               
            }
            else
                {
                echo "<status>False</status>";
                }
         }
         
        else {
                echo "<status>Provide Complete Parameters</status>";
          }
        
 
?>