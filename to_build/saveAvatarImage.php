<?php
  define('UPLOAD_DIR', 'avatar/');
	$img = $_POST['imgData'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . 'avatar_' . uniqid() . '.png';
	$success = file_put_contents($file, $data);
	echo $success ? $file : 'Unable to save the file.';
?>

