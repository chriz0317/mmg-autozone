$handle = fopen('recovered_dump.txt', "r");
$output = "";
$recording = false;
while (($line = fgets($handle)) !== false) {
    if (strpos($line, 'Showing lines 1 to 458') !== false) {
        $recording = true;
        // Skip the next line which is the warning
        fgets($handle);
        continue;
    }
    if ($recording) {
        if (strpos($line, 'The above content does NOT show') !== false || trim($line) === '=== TOOL CALL ===') {
            break;
        }
        // Remove line number prefix "1: "
        $output .= preg_replace('/^\d+:\s/', '', $line);
    }
}
fclose($handle);
file_put_contents('../resources/js/Pages/IntakeForm.jsx', $output);
echo "Recovered IntakeForm.jsx! Size: " . strlen($output);
