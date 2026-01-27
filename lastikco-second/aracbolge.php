<?php
require_once('database/db_conn.php');

$update_success_message = ""; // Başlangıçta boş bir başarı mesajı ayarlayın

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Formdan gelen verileri alın
    $bolge_id = $_POST['bolge_id'];

    // Veritabanından bölge adını almak için sorgu yapın
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    $sql = "SELECT bolge_name FROM bolge WHERE bolge_id = $bolge_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Sorgudan dönen veri varsa, ilk satırı alıp bölge adını $bolge_name değişkenine atayın
        $row = $result->fetch_assoc();
        $bolge_name = $row["bolge_name"];

        // Eğer car_id geçerli ise, veritabanında güncelleme yapın
        if (isset($_GET['car_id'])) {
            $car_id = $_GET['car_id'];

            $update_sql = "UPDATE cars SET arac_bolgesi = '$bolge_name' WHERE car_id = $car_id";

            // Güncelleme sorgusunu çalıştırın
            if ($conn->query($update_sql) === TRUE) {
                $update_success_message = "Araç bölgesi başarıyla güncellendi!";
                
                // Loglama işlemi
                $log_message = "Lastik bölgesi güncellendi - Araç ID: $car_id, Yeni Bölge: $bolge_name";
                $log_sql = "INSERT INTO logs (timestamp, message) VALUES (NOW(), '$log_message')";
                $conn->query($log_sql);
            } else {
                echo "Hata: " . $conn->error;
            }
        } else {
            echo "Car ID parametresi bulunamadı veya geçersiz.";
            exit; // Hata durumunda işlemi sonlandırın
        }
    } else {
        echo "Böyle bir bölge bulunamadı.";
        exit; // Hata durumunda işlemi sonlandırın
    }

    // Veritabanı bağlantısını kapatın
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Araç Bölge Değiştir</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h2>Araç Bölge Değiştir</h2>
    <?php if (!empty($update_success_message)) { ?>
        <p><?php echo $update_success_message; ?></p>
    <?php } ?>
    <form action="<?php echo $_SERVER['PHP_SELF'] . '?car_id=' . $_GET['car_id']; ?>" method="POST">
        <label for="bolge_id">Bölge Seç:</label>
        <select class="form-control" name="bolge_id" required>
            <?php
            // Veritabanından bölge bilgilerini al
            $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
            if ($conn->connect_error) {
                die("Bağlantı hatası: " . $conn->connect_error);
            }

            $sql = "SELECT bolge_id, bolge_name FROM bolge";
            $result = $conn->query($sql);

            // Sonuçları kontrol et ve option etiketlerini oluştur
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<option value='" . $row['bolge_id'] . "'>" . $row['bolge_name'] . "</option>";
                }
            } else {
                echo "<option value=''>Veritabanında bölge bulunamadı</option>";
            }

            // Veritabanı bağlantısını kapat
            $conn->close();
            ?>
        </select>
        <button type="submit">Kaydet</button>
    </form>
</body>
</html>
