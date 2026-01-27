<?php
// Include your database connection file
require_once('database/db_conn.php');

// Check if the 'update' key is present in the POST request
if (isset($_POST['update'])) {
    // Get other fields from the POST request
    $tire_id = $_POST['tire_id'];
    $seriNo = $_POST['tier_serino'];
    $marka = $_POST['tier_marka'];
    $desen = $_POST['tier_desen'];
    $olcu = $_POST['tier_olcu'];
    $durum = $_POST['tier_durum'];
    $olcumTarihi = $_POST['tier_olcumtarihi'];
    $olcumKM = $_POST['tier_olcumkm'];
    $firma = $_POST['firma'];
    $position = $_POST['tier_position'];
    $tier_resim_path = $_POST['tier_resim_path'];

    // Remove the 'data:image/jpeg;base64,' prefix from the base64 data
    $tier_resim_path = str_replace('data:image/jpeg;base64,', '', $tier_resim_path);

    // Decode the base64 data
  

    // Update the tire details in the database
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    $tireDetailsSql = "UPDATE tire_details 
                        SET tire_serino = '$seriNo', tire_marka = '$marka', tire_desen = '$desen', tire_olcu = '$olcu', 
                           tire_durum = '$durum', tire_olcumtarihi = '$olcumTarihi', 
                            tire_olcumkm = '$olcumKM', firma = '$firma', tire_position = '$position', tire_resim_path = '$tier_resim_path' 
                        WHERE tire_id = '$tire_id'";

    if ($conn->query($tireDetailsSql) === TRUE) {
        echo "Veri başarıyla güncellendi.";
        // Additional logic if needed
    } else {
        echo "Error: " . $tireDetailsSql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
