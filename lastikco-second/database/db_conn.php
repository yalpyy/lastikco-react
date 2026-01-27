<?php
$servername = "localhost"; // MySQL sunucu adı
$username = "root"; // MySQL kullanıcı adı
$password = ""; // MySQL şifre
$dbname = "lastik"; // Kullanılan veritabanının adı

// MySQL bağlantısını oluştur
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantıyı kontrol et
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}


// config.php

$database_config = array(
    'servername' => 'localhost',
    'username' => 'root',
    'password' => '',
    'dbname' => 'lastik'
);
?>