<?php
// Veritabanı bağlantısını yapın
require_once('database/db_conn.php');// Veritabanı bağlantısı yapıldığı varsayılan dosya adı

// Loglama fonksiyonunu tanımlayın
function writeToLog($message, $values = array()) {
    global $conn;
    $timestamp = date("Y-m-d H:i:s");
    $messageWithValues = $message . ' ' . implode(', ', $values);
    $sql = "INSERT INTO logs (timestamp, message) VALUES ('$timestamp', '$messageWithValues')";
    $conn->query($sql);
}

// car_id ve tire_id'yi alın
$car_id = isset($_GET['car_id']) ? $_GET['car_id'] : null;
$tire_id = isset($_GET['tire_id']) ? $_GET['tire_id'] : null;

if ($car_id === null || $tire_id === null) {
    // Hata mesajı veya varsayılan değeri burada belirleyebilirsiniz.
    echo "Hata: car_id veya tire_id parametresi eksik veya boş.";
    exit; // İşlemi sonlandır
}

// Formdan gelen verileri işle
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Eğer silme butonuna basıldıysa
    if (isset($_POST['delete_measurement'])) {
        // Silinecek ölçümün ID'sini al
        $measurement_id = $_POST['measurement_id'];

        // Ölçümü dis_derinligi tablosundan sil
        $sql = "DELETE FROM km_bilgi WHERE id = '$measurement_id'";

        if ($conn->query($sql) === TRUE) {
            $successMessage = "Ölçüm başarıyla silindi. ID: ";
            writeToLog($successMessage, [$measurement_id]);
            echo $successMessage . $measurement_id;
        } else {
            $errorMessage = "Hata: " . $sql . "<br>" . $conn->error;
            writeToLog($errorMessage);
            echo $errorMessage;
        }
    }

    // Eğer düzenleme butonuna basıldıysa
    elseif (isset($_POST['edit_measurement'])) {
        // Düzenlenecek ölçümün ID'sini al
        $measurement_id = $_POST['measurement_id'];

        // Seçilen ölçümün dış derinlik bilgisini al
        $sql = "SELECT km_bilgi FROM km WHERE id = '$measurement_id'";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $selected_measurement = $row['km'];

        // Düzenlenecek ölçümün bilgilerini form alanına doldur
        echo "
            <form method='post'>
                <input type='hidden' name='measurement_id' value='$measurement_id'>
                <label for='edited_measurement'>Yeni KM :</label>
                <input type='text' id='edited_measurement' name='edited_measurement' value='$selected_measurement'>
                <button type='submit' name='update_measurement'>Değiştir</button>
            </form>
        ";
    }

    // Eğer ekleme formu gönderildiyse
    elseif (isset($_POST['new_measurement'])) {
        // Formdan gelen verileri alın
        $new_measurement = $_POST['new_measurement'];

        // Son ölçümün değerini al
        $sql_last_measurement = "SELECT km FROM km_bilgi WHERE tire_id = '$tire_id' ORDER BY created_date DESC LIMIT 1";
        $result_last_measurement = $conn->query($sql_last_measurement);
        $last_measurement_row = $result_last_measurement->fetch_assoc();
        $last_measurement = isset($last_measurement_row['km']) ? $last_measurement_row['km'] : 0;

        // Yeni ölçüm değeri, son ölçümden büyük mü kontrol et
        if ($new_measurement <= $last_measurement) {
            $errorMessage = "Hata: Yeni ölçüm değeri, son ölçümden büyük olmalıdır. Yeni ölçüm: ";
            writeToLog($errorMessage, [$new_measurement]);
            echo $errorMessage . $new_measurement;
        } else {
            // Yeni ölçümü dis_derinligi tablosuna ekleyin
            $sql = "INSERT INTO km_bilgi (tire_id, km) VALUES ('$tire_id', '$new_measurement')";

            if ($conn->query($sql) === TRUE) {
                $successMessage = "Yeni ölçüm başarıyla eklendi. Yeni ölçüm: ";
                writeToLog($successMessage, [$new_measurement]);
                echo $successMessage . $new_measurement;
            } else {
                $errorMessage = "Hata: " . $sql . "<br>" . $conn->error;
                writeToLog($errorMessage);
                echo $errorMessage;
            }
        }
    }

    // Eğer güncelleme formu gönderildiyse
    elseif (isset($_POST['update_measurement'])) {
        // Güncellenecek ölçümün ID'sini ve yeni dış derinlik değerini al
        $measurement_id = $_POST['measurement_id'];
        $edited_measurement = $_POST['edited_measurement'];

        // Ölçümü güncelle
        $sql = "UPDATE km_bilgi SET km = '$edited_measurement' WHERE id = '$measurement_id'";

        if ($conn->query($sql) === TRUE) {
            $successMessage = "Ölçüm başarıyla güncellendi. Güncellenen ölçüm: ";
            writeToLog($successMessage, [$edited_measurement]);
            echo $successMessage . $edited_measurement;
        } else {
            $errorMessage = "Hata: " . $sql . "<br>" . $conn->error;
            writeToLog($errorMessage);
            echo $errorMessage;
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lastik Detayları</title>
    <!-- DataTables CSS dosyasını projenize ekleyin -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
        }
        canvas {
            margin-top: 20px;
        }
        .close-btn {
            float: right;
            margin-top: 20px;
            margin-right: 20px;
        }
    </style>
</head>
<body>

<div class="close-btn">
    <button onclick="window.close()">Kapat</button>
</div>

<form action="" method="post">
    <label for="new_measurement">Yeni Ölçüm:</label>
    <input type="text" id="new_measurement" name="new_measurement">
    <input type="submit" value="Ekle">
</form>

<h2>Lastik Detayları</h2>

<table>
    <thead>
    <tr>
        <th>Car Name</th>
        <th>Tire ID</th>
        <th>KM</th>
        <th>Created Date</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <?php
    // Veritabanından dis_derinligi verilerini al
    $sql = "SELECT d.id, d.tire_id, d.km, d.created_date, c.car_name 
            FROM km_bilgi d
            INNER JOIN tires t ON d.tire_id = t.tire_id
            INNER JOIN cars c ON t.car_id = c.car_id
            WHERE d.tire_id = '$tire_id'";
    $result = $conn->query($sql);

    // Sonuçları işle
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['car_name'] . "</td>";
            echo "<td>" . $row['tire_id'] . "</td>";
            echo "<td>" . $row['km'] . "</td>";
            echo "<td>" . $row['created_date'] . "</td>";
            echo "<td>
                    <form method='post'>
                        <input type='hidden' name='measurement_id' value='" . $row['id'] . "'>
                        <button type='submit' name='edit_measurement'>Düzenle</button>
                        <button type='submit' name='delete_measurement'>Sil</button>
                    </form>
                  </td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='5'>Veri bulunamadı.</td></tr>";
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
    ?>
    </tbody>
</table>

<canvas id="myChart"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
<script>
    // Veri tablosundan dış derinlik verilerini al
    var data = [
        <?php
        if ($result->num_rows > 0) {
            $result->data_seek(0);
            while ($row = $result->fetch_assoc()) {
                echo "'" . $row['km'] . "',";
            }
        }
        ?>
    ];

    // Oluşturulan tarih verilerini al
    var labels = [
        <?php
        if ($result->num_rows > 0) {
            $result->data_seek(0);
            while ($row = $result->fetch_assoc()) {
                echo "'" . $row['created_date'] . "',";
            }
        }
        ?>
    ];

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'KM',
                data: data,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
</script>

</body>
</html>