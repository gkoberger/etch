<?php
if($_POST['path'] && $_POST['saveas']) {
    $filename = "saved/" . $_POST['saveas'] . ".json";
    if(!file_exists($filename)) {
        $fh = fopen($filename, 'w') or die("Can't open file");

        $path = $_POST['path'];
        $pattern = '/[a-zA-Z]/';
        $replacement = '';
        $path = preg_replace($pattern, $replacement, $path);

        fwrite($fh, $path);
        fclose($fh);
    }
}

