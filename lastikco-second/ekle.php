<?php
// Veritabanı bağlantı bilgilerini içeri aktar
require_once('database/db_conn.php');

// Formdan gelen verileri al
$tire_id = $_POST['tire_id'];
$dis_derinligi = $_POST['dişDerinliği'];

// Veritabanı bağlantısını oluştur
$conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

// Bağlantı hatasını kontrol et
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

// Veriyi dis_derinligi tablosuna eklemek için SQL sorgusu oluştur
$sql = "INSERT INTO dis_derinligi (tire_id, dis_derinligi) VALUES ('$tire_id', '$dis_derinligi')";

// Sorguyu çalıştır ve sonucu kontrol et
if ($conn->query($sql) === TRUE) {
    echo "Diş derinliği başarıyla eklendi.";
} else {
    echo "Hata: " . $sql . "<br>" . $conn->error;
}

// Veritabanı bağlantısını kapat
$conn->close();
?>
