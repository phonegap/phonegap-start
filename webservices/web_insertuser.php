<?php
include_once('config.php');

        header("Content-type: text/xml");
      
                $name = $_REQUEST['ChildName'];
                $age = $_REQUEST['ChildAge'];
                $city  = $_REQUEST['ChildCity'];
                $address  = $_REQUEST['ChildAddress'];
                $wishes = $_REQUEST['ChildNoStudy'];
                $reason = $_REQUEST['Reason'];

         if($name && $age && $city && $address && $wishes && $reason)
         {
            $q = mysql_query("INSERT INTO users(name,age,country,city,address,wishes,reason) VALUES('$name','$age','Pakistan','$city','$address','$wishes','$reason')");
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