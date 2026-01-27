<?php
// Veritabanı bağlantı bilgilerini içe aktar
require_once('database/db_conn.php');

// POST isteği ile gönderilen verileri al
$tire_id = $_POST['tire_id'];
$dis_derinligi = $_POST['dis_derinligi'];

// Veritabanı bağlantısını oluştur
$conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

// Bağlantı hatasını kontrol et
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

// Diş derinliği bilgisini veritabanına ekle
$sql = "INSERT INTO dis_derinligi (tire_id, dis_derinligi) VALUES ('$tire_id', '$dis_derinligi')";

if ($conn->query($sql) === TRUE) {
    echo "Kayıt başarıyla eklendi!";
} else {
    echo "Hata: " . $sql . "<br>" . $conn->error;
}

// Veritabanı bağlantısını kapat
$conn->close();
?>
