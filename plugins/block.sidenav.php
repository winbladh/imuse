<?php


/*
<div class="successbox">
	<h3>Information</h3>
		<p>Configuration updated successfully.<br /><br /><a href="./index.php?i=attachments&amp;sid=5108c7db6b4a749bb66f144194c52fa9&amp;mode=attach">&laquo; Back to previous page</a></p>
		</div>
*/


function smarty_block_sidenav($params,$content,&$smarty, &$repeat)
{
	$lines = explode("\n", trim($content));
	
	$sidenav = array();

	foreach($lines as $line)
	{
		if(strpos($line,"|"))
		{
			list($name,$url) = explode("|",$line);
			$sidenav[] = array($name,$url);
		}
		else
		{
			$sidenav[] = $line;
		}

	}
	
	$smarty->assign("g_sidenav", $sidenav);
	//$smarty->assign("g_header_stuff", $content);
}


?>
