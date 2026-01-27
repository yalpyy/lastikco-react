<!DOCTYPE html>
<?php
    // Bu kod, car_id bilgisini alarak butonun içeriğini oluşturuyor.
    $car_id = $_GET['car_id'];
?>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lastik Detayları</title>
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
require_once('database/db_conn.php');

// Loglama fonksiyonu
function logMessage($message) {
    global $conn, $car_id;
    $timestamp = date("Y-m-d H:i:s");
    $sql = "INSERT INTO logs (timestamp, message) VALUES ('$timestamp', '$message Car ID: $car_id')";
    $conn->query($sql);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
    
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }
    
    if (isset($_POST['tire_id'])) {
        $tire_id = $_POST['tire_id'];
        $tire_status = '';

        if (isset($_POST['kaplama'])) {
            $firma = $_POST['firma'];
            $tire_status = 'kaplama';
            logMessage("Tire ID: $tire_id - Kaplama işlemi gerçekleştirildi.");
        } elseif (isset($_POST['tamirli'])) {
            $tire_status = 'tamirli';
            logMessage("Tire ID: $tire_id - Tamirli işlemi gerçekleştirildi.");
        } elseif (isset($_POST['stepne'])) {
            $tire_status = 'stepne';
            logMessage("Tire ID: $tire_id - Stepne işlemi gerçekleştirildi.");
        } elseif (isset($_POST['cikma'])) {
            $tire_status = 'çıkma lastik';
            logMessage("Tire ID: $tire_id - Çıkma Lastik işlemi gerçekleştirildi.");
        } elseif (isset($_POST['hurda'])) {
            $tire_status = 'hurda';
            logMessage("Tire ID: $tire_id - Hurda işlemi gerçekleştirildi.");
        }

        if (!empty($tire_status)) {
            $sql_select_tire = "SELECT * FROM tire_details WHERE tire_id = '$tire_id'";
            $result_select_tire = $conn->query($sql_select_tire);
            $tire_details = $result_select_tire->fetch_assoc();

            $firma = isset($firma) ? $firma : '';

            // Check if tire_olcumkm is set, if not set it to NULL
            $tire_olcumkm = isset($tire_details['tire_olcumkm']) ? "'{$tire_details['tire_olcumkm']}'" : "NULL";

            $sql_insert_havuz = "INSERT INTO lastik_havuz (id, tire_id, tire_serino, tire_marka, tire_desen, tire_olcu, tire_disderinligi, tire_durum, tire_olcumkm, created_by, created_date, firma)
                                 VALUES (NULL,'{$tire_details['tire_id']}', '{$tire_details['tire_serino']}', '{$tire_details['tire_marka']}', '{$tire_details['tire_desen']}', '{$tire_details['tire_olcu']}', '{$tire_details['tire_disderinligi']}', '$tire_status', $tire_olcumkm, '{$tire_details['created_by']}', '{$tire_details['created_date']}', '$firma')";

            if ($conn->query($sql_insert_havuz) === TRUE) {
                echo "Lastik başarıyla $tire_status olarak işaretlendi.";

                $sql_update_tires = "UPDATE tires SET car_id = NULL WHERE tire_id = '$tire_id'";
                if ($conn->query($sql_update_tires) === TRUE) {
                    echo " Tires tablosundaki veriler başarıyla güncellendi.";

                    $sql_delete_tire_details = "DELETE FROM tire_details WHERE tire_id = '$tire_id'";
                    if ($conn->query($sql_delete_tire_details) === TRUE) {
                        echo " Tire_details tablosundaki veri başarıyla silindi.";

                        // dis_derinligi tablosuna bağlanmak için gereken bağlantı bilgileri
                        $dis_derinligi_conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

                        if ($dis_derinligi_conn->connect_error) {
                            die("dis_derinligi Tablosu Bağlantı Hatası: " . $dis_derinligi_conn->connect_error);
                        }

                        $sql_delete_dis_derinligi = "DELETE FROM dis_derinligi WHERE tire_id = '$tire_id'";

                        if ($dis_derinligi_conn->query($sql_delete_dis_derinligi) === TRUE) {
                            echo " dis_derinligi tablosundaki veriler başarıyla silindi.";
                        } else {
                            echo "Hata: " . $sql_delete_dis_derinligi . "<br>" . $dis_derinligi_conn->error;
                        }

                        $dis_derinligi_conn->close();
                    } else {
                        echo "Hata: " . $sql_delete_tire_details . "<br>" . $conn->error;
                    }
                } else {
                    echo "Hata: " . $sql_update_tires . "<br>" . $conn->error;
                }
            } else {
                echo "Hata: " . $sql_insert_havuz . "<br>" . $conn->error;
            }
        } else {
            echo "Hata: Durum belirtilmedi.";
        }
    } else {
        echo "Hata: Lastik ID belirtilmedi.";
    }
    $conn->close();
}
?>

<h2>Lastik Detayları</h2>

<table id="lastikDetaylari">
    <thead>
        <tr>
            <th>Position</th>
            <th>Seri No</th>
            <th>Marka</th>
            <th>Desen</th>
            <th>Ölçü</th>
            <th>Diş Derinliği</th>
            <th>Durum</th>
            <th>Ölçüm Tarihi</th>
            <th>Ölçüm KM</th>
            <th>Oluşturan</th>
            <th>Oluşturma Tarihi</th>
            <th>Kaplama</th>
            <th>Tamirli</th>
            <th>Stepne</th>
            <th>Çıkma Lastik</th>
            <th>Hurda</th>
        </tr>
    </thead>
    <tbody>
    
    <?php
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    $car_id = $_GET['car_id'];
    $sql = "SELECT td.tire_id, td.tire_position, td.tire_serino, td.tire_marka, td.tire_desen, td.tire_olcu, td.tire_disderinligi, td.tire_durum, td.tire_olcumtarihi, td.tire_olcumkm, td.tire_resim_path, td.created_by, td.created_date
            FROM tires t
            JOIN tire_details td ON t.tire_id = td.tire_id
            WHERE t.car_id = '$car_id'";

    $result = $conn->query($sql);

    if ($result !== false && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>{$row['tire_position']}</td>";
            echo "<td>{$row['tire_serino']}</td>";
            echo "<td>{$row['tire_marka']}</td>";
            echo "<td>{$row['tire_desen']}</td>";
            echo "<td>{$row['tire_olcu']}</td>";
            echo "<td>{$row['tire_disderinligi']}</td>";
            echo "<td>{$row['tire_durum']}</td>";
            echo "<td>{$row['tire_olcumtarihi']}</td>";
            echo "<td>{$row['tire_olcumkm']}</td>";
            echo "<td>{$row['created_by']}</td>";
            echo "<td>{$row['created_date']}</td>";
            echo "<td><form method='post'><input type='hidden' name='tire_id' value='{$row['tire_id']}'> 
            <input type='text' name='firma' placeholder='Firma'> <button type='submit' name='kaplama'>Kaplama</button></form></td>";
            echo "<td><form method='post'><input type='hidden' name='tire_id' value='{$row['tire_id']}'><button type='submit' name='tamirli'>Tamirli</button></form></td>";
            echo "<td><form method='post'><input type='hidden' name='tire_id' value='{$row['tire_id']}'><button type='submit' name='stepne'>Stepne</button></form></td>";
            echo "<td><form method='post'><input type='hidden' name='tire_id' value='{$row['tire_id']}'><button type='submit' name='cikma'>Çıkma Lastik</button></form></td>";
            echo "<td><form method='post'><input type='hidden' name='tire_id' value='{$row['tire_id']}'><button type='submit' name='hurda'>Hurda</button></form></td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='16'>0 sonuç</td></tr>";
    }

    $result->close();
    $conn->close();
    ?>
    </tbody>
</table>

<canvas id="myChart"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
<script>
    $(document).ready( function () {
        $('#lastikDetaylari').DataTable();
    } );
</script>

</body>
</html>
