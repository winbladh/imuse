<?php

function smarty_function_submit_buttons($params,&$smarty)
{
	$data = "<fieldset class=\"submit-buttons\">";
	$data .= "<legend>Submit</legend>";
	
	$data .= "<input type=\"submit\" class=\"button1\" value=\"Submit\" />";
	
	if($params['noreset']!=1)
	{
		$data .= "&nbsp;<input type=\"reset\" class=\"button2\" value=\"Reset\" />";
	}
	
	$data .= "</fieldset>";
	
	return $data;
}


?>
