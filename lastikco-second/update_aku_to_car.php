<?php
// Veritabanı bağlantı bilgilerini içe aktar
require_once('database/db_conn.php');

// Aracın ve lastiğin ID'lerini al
$aku_id = $_POST['aku_id'];
$car_id = $_POST['car_id'];

// Veritabanı bağlantısını oluştur
$conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

// Bağlantı hatasını kontrol et
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

// Lastiği araca ekle
$sql = "UPDATE aku SET car_id = $car_id WHERE aku_id = $aku_id";

if ($conn->query($sql) === TRUE) {
    echo "Akü başarıyla araca eklendi.";
} else {
    echo "Hata: " . $conn->error;
}

// Veritabanı bağlantısını kapat
$conn->close();
?>
