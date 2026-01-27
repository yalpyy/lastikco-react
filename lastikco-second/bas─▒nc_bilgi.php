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

<?php
// Veritabanı bağlantısını yapın
require_once('database/db_conn.php');// Veritabanı bağlantısı yapıldığı varsayılan dosya adı

// Loglama fonksiyonu
function logMessage($conn, $message) {
    $timestamp = date("Y-m-d H:i:s");
    $log_sql = "INSERT INTO logs (timestamp, message) VALUES ('$timestamp', '$message')";
    $conn->query($log_sql);
}

// dis_derinligi.php sayfası

// car_id ve tire_id'yi alın
$car_id = $_GET['car_id'];
$tire_id = $_GET['tire_id'];

// Formdan gelen verileri işle
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Eğer silme butonuna basıldıysa
    if (isset($_POST['delete_measurement'])) {
        // Silinecek ölçümün ID'sini al
        $measurement_id = $_POST['measurement_id'];

        // Ölçümü dis_derinligi tablosundan sil
        $sql = "DELETE FROM basınc_bilgi WHERE id = '$measurement_id'";

        if ($conn->query($sql) === TRUE) {
            logMessage($conn, "Ölçüm silindi - Ölçüm ID: $measurement_id");
            echo "Ölçüm başarıyla silindi.";
        } else {
            echo "Hata: " . $sql . "<br>" . $conn->error;
        }
    }

    // Eğer düzenleme butonuna basıldıysa
    elseif (isset($_POST['edit_measurement'])) {
        // Düzenlenecek ölçümün ID'sini al
        $measurement_id = $_POST['measurement_id'];

        // Seçilen ölçümün dış derinlik bilgisini al
        $sql = "SELECT basınc_bilgi FROM basınc WHERE id = '$measurement_id'";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $selected_measurement = $row['basınc'];

        // Düzenlenecek ölçümün bilgilerini form alanına doldur
        echo "
            <form method='post'>
                <input type='hidden' name='measurement_id' value='$measurement_id'>
                <label for='edited_measurement'>Yeni Dış Derinlik:</label>
                <input type='text' id='edited_measurement' name='edited_measurement' value='$selected_measurement'>
                <button type='submit' name='update_measurement'>Değiştir</button>
            </form>
        ";
    }

    // Eğer ekleme formu gönderildiyse
    elseif (isset($_POST['new_measurement'])) {
        // Formdan gelen verileri alın
        $new_measurement = $_POST['new_measurement'];

        // Yeni ölçümü dis_derinligi tablosuna ekleyin
        $sql = "INSERT INTO basınc_bilgi (tire_id, basınc) VALUES ('$tire_id', '$new_measurement')";

        if ($conn->query($sql) === TRUE) {
            logMessage($conn, "Yeni ölçüm eklendi - Ölçüm: $new_measurement");
            echo "Yeni ölçüm başarıyla eklendi.";
        } else {
            echo "Hata: " . $sql . "<br>" . $conn->error;
        }
    }

    // Eğer güncelleme formu gönderildiyse
    elseif (isset($_POST['update_measurement'])) {
        // Güncellenecek ölçümün ID'sini ve yeni dış derinlik değerini al
        $measurement_id = $_POST['measurement_id'];
        $edited_measurement = $_POST['edited_measurement'];

        // Ölçümü güncelle
        $sql = "UPDATE basınc_bilgi SET basınc = '$edited_measurement' WHERE id = '$measurement_id'";

        if ($conn->query($sql) === TRUE) {
            logMessage($conn, "Ölçüm güncellendi - Ölçüm ID: $measurement_id, Yeni Ölçüm: $edited_measurement");
            echo "Ölçüm başarıyla güncellendi.";
        } else {
            echo "Hata: " . $sql . "<br>" . $conn->error;
        }
    }
    elseif (isset($_POST['show_km'])) {
    // km_bilgi tablosundan verileri al
    $sql_km = "SELECT id, basınc FROM basınc_bilgi";
    $result_km = $conn->query($sql_km);

    // Sonuçları işle
    if ($result_km->num_rows > 0) {
        echo "<table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Basınc</th>
                    </tr>
                </thead>
                <tbody>";
        while ($row_km = $result_km->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row_km['id'] . "</td>";
            echo "<td>" . $row_km['basınc'] . "</td>";
            echo "</tr>";
        }
        echo "</tbody></table>";
    } else {
        echo "Veri bulunamadı.";
    }
}

}
?>

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
        <th>Basınc</th>
        <th>Created Date</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <?php
    // Gönderilen tire_id parametresini al
    $tire_id = $_GET['tire_id'];

    // Veritabanından dis_derinligi verilerini al
    $sql = "SELECT d.id, d.tire_id, d.basınc, d.created_date, c.car_name 
            FROM basınc_bilgi d
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
            echo "<td>" . $row['basınc'] . "</td>";
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
<script>
    function redirectToKmBilgi() {
        window.location.href = 'basınc_bilgi.php'; // Yönlendirme işlemi
    }
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
<script>

    

    // Veri tablosundan dış derinlik verilerini al
    var data = [
        <?php
        if ($result->num_rows > 0) {
            $result->data_seek(0);
            while ($row = $result->fetch_assoc()) {
                echo "'" . $row['basınc'] . "',";
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
                label: 'Basınç',
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