<!DOCTYPE html>
<html>
<head>
    <title>Lastik Detayları</title>
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
    </style>
</head>
<body>

<h2>Lastik Detayları</h2>

<table>
    <thead>
    <tr>
        <th>Tire ID</th>
        <th>Dış Derinlik</th>
        <th>Created Date</th>
    </tr>
    </thead>
    <tbody>
    <?php
    // Veritabanı bağlantı bilgilerini içe aktar
    require_once('database/db_conn.php');

    // Bağlantıyı oluştur
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

    // Bağlantı hatasını kontrol et
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    // Gönderilen tire_id parametresini al
    $tire_id = $_GET['tire_id'];

    // Veritabanından dis_derinligi verilerini al
    $sql = "SELECT tire_id, dis_derinligi, created_date FROM dis_derinligi WHERE tire_id = '$tire_id'";
    $result = $conn->query($sql);

    // Sonuçları işle
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['tire_id'] . "</td>";
            echo "<td>" . $row['dis_derinligi'] . "</td>";
            echo "<td>" . $row['created_date'] . "</td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='2'>Veri bulunamadı.</td></tr>";
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
        $result->data_seek(0);
        while ($row = $result->fetch_assoc()) {
            echo "'" . $row['dis_derinligi'] . "',";
        }
        ?>
    ];

    // Oluşturulan tarih verilerini al
    var labels = [
        <?php
        $result->data_seek(0);
        while ($row = $result->fetch_assoc()) {
            echo "'" . $row['created_date'] . "',";
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
