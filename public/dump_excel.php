<?php
$file = '2605006-Estimate-NHR3229-2023-Toyota-Avanza-Mary-Lou-Orande.xlsx';
$zip = new ZipArchive;
if ($zip->open($file) === TRUE) {
    // Read shared strings
    $sharedStringsXml = $zip->getFromName('xl/sharedStrings.xml');
    $strings = [];
    if ($sharedStringsXml) {
        $xml = simplexml_load_string($sharedStringsXml);
        foreach ($xml->si as $val) {
            $strings[] = (string)$val->t;
        }
    }
    
    // Read sheet1
    $sheet1Xml = $zip->getFromName('xl/worksheets/sheet1.xml');
    if ($sheet1Xml) {
        $xml = simplexml_load_string($sheet1Xml);
        echo "<h1>Strings in Sheet1</h1><ul>";
        foreach ($xml->sheetData->row as $row) {
            foreach ($row->c as $c) {
                if ((string)$c['t'] == 's') {
                    $idx = (int)$c->v;
                    if (isset($strings[$idx])) {
                        echo "<li>Row {$row['r']}, Col {$c['r']}: " . htmlspecialchars($strings[$idx]) . "</li>";
                    }
                } else if (isset($c->v)) {
                    echo "<li>Row {$row['r']}, Col {$c['r']}: " . htmlspecialchars((string)$c->v) . "</li>";
                }
            }
        }
        echo "</ul>";
    } else {
        echo "Sheet1 not found.";
    }
    $zip->close();
} else {
    echo "Failed to open zip.";
}
