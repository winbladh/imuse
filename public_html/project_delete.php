<?php

include "includes.php";

$deleteProject = $_GET['projectid'];

$DB->query("DELETE FROM projects WHERE projectid='$deleteProject' LIMIT 1");

header("Location: project_list.php");
die();


?>
