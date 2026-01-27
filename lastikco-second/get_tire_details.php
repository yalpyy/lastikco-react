<?php
// Include your database connection file (db_conn.php) and any other necessary files
require_once('database/db_conn.php');

// Assuming your tires table structure, adjust as needed
$tireId = $_POST['tire_id'];

// Initialize an empty array to store the tire details
$tireDetails = array();

// Connect to the database
$conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
}

// Query to retrieve tire details based on tire_id
$sql = "SELECT tire_serino, tire_marka, tire_desen, tire_olcu, tire_disderinligi, tire_durum, tire_olcumtarihi, tire_olcumkm, tire_position, tire_resim_path
        FROM tire_details
        WHERE tire_id = $tireId";

$result = $conn->query($sql);

if ($result !== false && $result->num_rows > 0) {
    // Fetch the tire details and store them in the $tireDetails array
    $row = $result->fetch_assoc();
    $tireDetails = array(
        'tire_serino' => $row['tire_serino'],
        'tire_marka' => $row['tire_marka'],
        'tire_desen' => $row['tire_desen'],
        'tire_olcu' => $row['tire_olcu'],
        'tire_disderinligi' => $row['tire_disderinligi'],
        'tire_durum' => $row['tire_durum'],
        'tire_olcumtarihi' => $row['tire_olcumtarihi'],
        'tire_olcumkm' => $row['tire_olcumkm'],
        'tire_position' => $row['tire_position'],
        'tire_resim_path' => $row['tire_resim_path']
    );
}

// Close the database connection
$conn->close();

// Return the tire details as JSON
header('Content-Type: application/json');
echo json_encode($tireDetails);
?>
