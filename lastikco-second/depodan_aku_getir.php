<!DOCTYPE html>
<html>
<head>
        <meta charset="UTF-8">
      <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">

      <!-- bootstrap css --> 
      <link rel="stylesheet" href="css/bootstrap.min.css" >
      <!-- site css -->
    
      <!-- responsive css -->
      <link rel="stylesheet" href="css/responsive.css" />
      <!-- color css -->
      <link rel="stylesheet" href="css/colors.css" />
      <!-- select bootstrap -->
      <link rel="stylesheet" href="css/bootstrap-select.css" />
      <!-- scrollbar css -->
      <link rel="stylesheet" href="css/perfect-scrollbar.css" />
      <!-- custom css -->
      
     
      <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.1.2/css/buttons.dataTables.min.css">
      <!-- color css -->
      
     
      <!-- site css -->
      <link rel="stylesheet" href="css/font-awesome.min.css" />
      <!-- responsive css -->

</head>
<body>

<!-- Arama kutusu eklenmiş tablo -->
<div class="table-container">
    <div class="search-container">
        <input type="text" id="searchInput" onkeyup="searchTable()" placeholder="Tabloda ara...">
    </div>
    <table id="tireTable" class="table table-hover text-center">
        <thead class="table-dark">
        <tr>
            <th scope="col">Aku id</th>
            <th scope="col">Akü Durum</th>
            <th scope="col">Akü Marka</th>
            <th scope="col">Akü Watt</th>
            <th scope="col">Akü Amper</th>
            <th scope="col">Fatura Tarihi</th>
            <th scope="col">Oluşturan</th>
            <th scope="col">Araca Ekle</th>
        </tr>
        </thead>
        <tbody>
        <!-- Tablo içeriği burada üretilecek -->
        <?php
// Veritabanı bağlantı bilgilerini içe aktar
require_once('database/db_conn.php');

// Aracın car_id değerini al
$car_id = $_GET['car_id'];

// Veritabanı bağlantısını oluştur
$conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

// Bağlantı hatasını kontrol et
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

// Aküleri veritabanından getir
$sql = "SELECT * FROM aku WHERE car_id IS NULL";

$result = $conn->query($sql);

// Sonuçları işle
if ($result !== false && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Her bir akü için tablo satırını oluştur
        echo "<tr>";
        echo "<td>" . $row['aku_id'] . "</td>";
        echo "<td>" . $row['durum'] . "</td>";
        echo "<td>" . $row['marka'] . "</td>";
        echo "<td>" . $row['watt'] . "</td>";
        echo "<td>" . $row['amper'] . "</td>";
        echo "<td>" . $row['faturatarihi'] . "</td>";
        echo "<td>" . $row['created_by'] . "</td>";
        // Action butonu ekle
        echo "<td><button onclick=\"addAkuToCar(" . $row['aku_id'] . ", $car_id)\" class=\"btn cur-p btn-outline-warning\">Araca Ekle</button></td>";
        echo "</tr>";
    }
} else {
    // Veritabanında uygun akü yoksa veya herhangi bir hata oluşursa bir mesaj döndür
    echo "<tr><td colspan='6'>Depodan uygun akü bulunamadı.</td></tr>";
}

// Veritabanı bağlantısını kapat
$conn->close();
?>

        </tbody>
    </table>
</div>

<!-- DataTables JavaScript dosyasını projenize ekleyin -->
<script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>




<script>
    $(document).ready(function() {
        // DataTables'i başlat
        $('#akuTable').DataTable({
            searching: true // Arama özelliğini etkinleştir
        });
    }); 
   

    function addAkuToCar(aku_id, car_id) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "update_aku_to_car.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
            }
        };
        xhr.send("aku_id=" + aku_id + "&car_id=" + car_id);
    }

    function searchTable() {
        // Arama kutusundaki değeri al
        var input = document.getElementById("searchInput");
        var filter = input.value.toUpperCase();

        // Tablo içinde ara
        var table = document.getElementById("akuTable");
        var tr = table.getElementsByTagName("tr");
        for (var i = 0; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td")[0]; // Pozisyon sütunu için filtreleme yapabilirsiniz.
            if (td) {
                var txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

</script>
 
</body>
</html>







