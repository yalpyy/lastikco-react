<?php
// Veritabanı bağlantı bilgilerini içe aktar
require_once('database/db_conn.php');

// POST isteğini kontrol et
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Aracın ve lastiğin ID'lerini al
    $tire_id = $_POST['tire_id'];
    $car_id = $_POST['car_id'];

    // Veritabanı bağlantısını oluştur
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

    // Bağlantı hatasını kontrol et
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    // Veritabanına lastiği araca ekle
    $sql_insert_tire = "UPDATE tires SET car_id = ? WHERE tire_id = ?";
    $stmt_insert_tire = $conn->prepare($sql_insert_tire);
    $stmt_insert_tire->bind_param("ii", $car_id, $tire_id);

    if ($stmt_insert_tire->execute()) {
        // Log mesajını oluştur
        $log_message = "Araba (ID: $car_id) için lastik (ID: $tire_id) başarıyla eklendi.";

        // Logs tablosuna log mesajını ve timestamp'i ekle
        $sql_insert_log = "INSERT INTO logs (timestamp, message) VALUES (NOW(), ?)";
        $stmt_insert_log = $conn->prepare($sql_insert_log);
        $stmt_insert_log->bind_param("s", $log_message);
        $stmt_insert_log->execute();

        echo "Lastik başarıyla araca eklendi.";

        // Tire_disderinligi bilgisini tire_id kullanarak tire_details tablosundan al
        $sql_get_depth = "SELECT tire_disderinligi FROM tire_details WHERE tire_id = ?";
        $stmt_get_depth = $conn->prepare($sql_get_depth);
        $stmt_get_depth->bind_param("i", $tire_id);
        $stmt_get_depth->execute();
        $result = $stmt_get_depth->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $tire_disderinligi = $row['tire_disderinligi'];

            // Dis derinliği bilgisini dis_derinligi tablosuna ekle
            $sql_insert_depth = "INSERT INTO dis_derinligi (tire_id, tire_disderinligi) VALUES (?, ?)";
            $stmt_insert_depth = $conn->prepare($sql_insert_depth);
            $stmt_insert_depth->bind_param("ii", $tire_id, $tire_disderinligi);

            if ($stmt_insert_depth->execute()) {
                // Log mesajını oluştur
                $log_message_depth = "Lastik (ID: $tire_id) için dis derinliği başarıyla eklendi.";

                // Logs tablosuna dis derinliği log mesajını ve timestamp'i ekle
                $sql_insert_log_depth = "INSERT INTO logs (timestamp, message) VALUES (NOW(), ?)";
                $stmt_insert_log_depth = $conn->prepare($sql_insert_log_depth);
                $stmt_insert_log_depth->bind_param("s", $log_message_depth);
                $stmt_insert_log_depth->execute();

                echo " Dis derinliği başarıyla eklendi.";
            } else {
                echo " Dis derinliği eklenirken hata oluştu: " . $stmt_insert_depth->error;
            }
        } else {
            echo "Tire_details tablosunda belirtilen tire_id için dis derinliği bilgisi bulunamadı.";
        }
    } else {
        echo "Hata: " . $stmt_insert_tire->error;
    }

    // Bağlantıyı kapat
    $stmt_insert_tire->close();
    $stmt_get_depth->close();
    $stmt_insert_depth->close();
    $stmt_insert_log->close();
    $stmt_insert_log_depth->close();
    $conn->close();
}
?>
