<?php
require_once('database/db_conn.php');

// Veritabanı bağlantısını oluştur
$conn = new mysqli($servername, $username, $password, $dbname);

// Veritabanı bağlantı hatası kontrolü
if ($conn->connect_error) {
    die("Veritabanına bağlanılamadı: " . $conn->connect_error);
}

// Log fonksiyonu: Veritabanına log mesajını kaydeder
function logToDatabase($message, $conn) {
    $sql = "INSERT INTO logs (message) VALUES ('$message')";
    if ($conn->query($sql) === TRUE) {
        echo "Log başarıyla kaydedildi.";
    } else {
        echo "Log kaydedilirken bir hata oluştu: " . $conn->error;
    }
}

// Yeni ölçüm ekleme işlemi
function addMeasurement($new_measurement, $tire_id, $conn, $threshold) {
    $last_measurement_sql = "SELECT tire_disderinligi FROM dis_derinligi WHERE tire_id = '$tire_id' ORDER BY created_date DESC LIMIT 1";
    $last_measurement_result = $conn->query($last_measurement_sql);
    if ($last_measurement_result->num_rows > 0) {
        $last_measurement_row = $last_measurement_result->fetch_assoc();
        $last_measurement_value = $last_measurement_row['tire_disderinligi'];

        if ($new_measurement >= $last_measurement_value) {
            echo "<p style='color: red;'>Hata: Yeni ölçüm, en son ölçümden büyük veya eşit olamaz.</p>";
            logToDatabase("Hata: Yeni ölçüm, en son ölçümden büyük veya eşit olamaz - Tire ID: $tire_id, Yeni Ölçüm: $new_measurement", $conn);
        } else {
            $sql = "INSERT INTO dis_derinligi (tire_id, tire_disderinligi) VALUES ('$tire_id', '$new_measurement')";
            if ($conn->query($sql) === TRUE) {
                echo "<p>Yeni ölçüm başarıyla eklendi.</p>";
                logToDatabase("Yeni ölçüm eklendi - Tire ID: $tire_id, Ölçüm: $new_measurement", $conn);

                // Dış derinlik eşik değerini kontrol et
                if ($new_measurement < $threshold) {
                    echo '<li><a href="#"><i class="fa fa-envelope-o"></i><span class="badge">' . $tire_id . '</span></a></li>';
                    logToDatabase("Dış derinlik eşik değerinin altında ölçüm - Tire ID: $tire_id, Ölçüm: $new_measurement", $conn);
                }
            } else {
                echo "<p style='color: red;'>Hata: " . $sql . "<br>" . $conn->error . "</p>";
                logToDatabase("Hata: Yeni ölçüm eklenirken bir sorun oluştu - SQL: $sql, Hata: " . $conn->error, $conn);
            }
        }
    }
}

// Ölçüm silme işlemi
function deleteMeasurement($measurement_id, $conn) {
    $delete_sql = "DELETE FROM dis_derinligi WHERE id = '$measurement_id'";
    if ($conn->query($delete_sql) === TRUE) {
        echo "<p>Ölçüm başarıyla silindi.</p>";
        logToDatabase("Ölçüm silindi - Measurement ID: $measurement_id", $conn);
    } else {
        echo "<p style='color: red;'>Hata: Ölçüm silinirken bir sorun oluştu.</p>";
        logToDatabase("Hata: Ölçüm silinirken bir sorun oluştu - Measurement ID: $measurement_id, Hata: " . $conn->error, $conn);
    }
}

// İşlem metodu kontrolü
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['new_measurement'])) {
        $new_measurement = $_POST['new_measurement'];
        $tire_id = $_GET['tire_id'];
        $threshold = 1.5; // Örnek bir eşik değeri, istediğiniz değeri kullanabilirsiniz
        addMeasurement($new_measurement, $tire_id, $conn, $threshold);
    } elseif (isset($_POST['delete_measurement'])) {
        $measurement_id = $_POST['measurement_id'];
        deleteMeasurement($measurement_id, $conn);
    }
}
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        <th>Dış Derinlik</th>
        <th>Created Date</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <?php
    $tire_id = $_GET['tire_id'];

    $sql = "SELECT d.id, d.tire_id, d.tire_disderinligi, d.created_date, c.car_name 
            FROM dis_derinligi d
            INNER JOIN tires t ON d.tire_id = t.tire_id
            INNER JOIN cars c ON t.car_id = c.car_id
            WHERE d.tire_id = '$tire_id'";
    $result = $conn->query($sql);

    if ($result === FALSE) {
        echo "Sorguda bir hata oluştu: " . $conn->error;
        logToDatabase("Sorguda bir hata oluştu: " . $conn->error, $conn);
    } else {
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row['car_name'] . "</td>";
                echo "<td>" . $row['tire_id'] . "</td>";
                echo "<td>" . $row['tire_disderinligi'] . "</td>";
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
    }

    $conn->close();
    ?>
    </tbody>
</table>

<canvas id="myChart"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
<script>
    var data = [
        <?php
        if ($result->num_rows > 0) {
            $result->data_seek(0);
            while ($row = $result->fetch_assoc()) {
                echo "'" . $row['tire_disderinligi'] . "',";
            }
        }
        ?>
    ];

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
                label: 'Dış Derinlik',
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