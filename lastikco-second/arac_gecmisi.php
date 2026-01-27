<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Araç Geçmişi</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        .pagination a {
            padding: 8px 16px;
            text-decoration: none;
            color: black;
            border: 1px solid #ddd;
            margin: 0 4px;
        }
        .pagination a.active {
            background-color: #4CAF50;
            color: white;
        }
    </style>
</head>
<body>

<?php
require_once('database/db_conn.php');

// Araç ID'sini al
$car_id = $_GET['car_id'];

// Car_name'i al
$car_name_sql = "SELECT car_name FROM cars WHERE car_id = $car_id";
$car_name_result = $conn->query($car_name_sql);
if ($car_name_result->num_rows > 0) {
    $car_name = $car_name_result->fetch_assoc()['car_name'];
} else {
    $car_name = "Bilinmeyen Araç";
}

// Sayfalama için parametreleri al
$page = isset($_GET['page']) ? $_GET['page'] : 1;
$records_per_page = 25;
$offset = ($page - 1) * $records_per_page;

// Toplam kayıt sayısını al
$total_records_sql = "SELECT COUNT(*) AS total FROM logs WHERE message LIKE '%$car_id%'";
$total_records_result = $conn->query($total_records_sql);
$total_records = $total_records_result->fetch_assoc()['total'];

// Toplam sayfa sayısını hesapla
$total_pages = ceil($total_records / $records_per_page);

// SQL sorgusu
$sql = "SELECT * FROM logs WHERE message LIKE '%$car_id%' ORDER BY id DESC LIMIT $offset, $records_per_page";

$result = $conn->query($sql);

if ($result === false) {
    echo "Sorgu hatası: " . $conn->error;
} else {
    if ($result->num_rows > 0) {
        echo "<table>
        <tr>
        <th>ID</th>
        <th>Car Name</th>
        <th>Message</th>
        <th>Timestamp</th>
        </tr>";
        while($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $car_name . "</td>"; // Car Name'i ekle
            echo "<td>" . $row['message'] . "</td>";
            echo "<td>" . $row['timestamp'] . "</td>"; // Eklenen satır
            echo "</tr>";
        }
        echo "</table>";

        // Sayfalama linkleri
        echo "<div class='pagination'>";
        for ($i = 1; $i <= $total_pages; $i++) {
            echo "<a href='?car_id=$car_id&page=$i'" . ($page == $i ? " class='active'" : "") . ">$i</a>";
        }
        echo "</div>";
    } else {
        echo "Kayıt bulunamadı.";
    }
}

$conn->close();
?>

</body>
</html>
