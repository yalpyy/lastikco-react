<!DOCTYPE html>
<?php 
require_once('database/db_conn.php'); ?>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="viewport" content="initial-scale=1, maximum-scale=1">
<link rel="stylesheet" type="text/css" href="style.css">
<title>Lastik.co Anasayfa</title>
<meta name="keywords" content="">
<meta name="description" content="">
<meta name="author" content="">
<link rel="icon" href="images/fevicon.png" type="image/png" />
<link rel="stylesheet" href="css/bootstrap.min.css" >
<link rel="stylesheet" href="css/responsive.css" />
<link rel="stylesheet" href="css/colors.css" />
<link rel="stylesheet" href="css/bootstrap-select.css" />
<link rel="stylesheet" href="css/perfect-scrollbar.css" />
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.1.2/css/buttons.dataTables.min.css">
<link rel="stylesheet" href="css/font-awesome.min.css" />
</head>
<body>

<script type="text/javascript" src="js/jquery.min.js"></script>

<div class="table-container">
    <div class="search-container">
        <div name="Formundivi">
            <div class="col-md-3">
                <div class="form-group">
                    <label for="search_Input" class="form-label">Seri No Filtresi </label>
                    <input type="text" id="searchInput" onkeyup="searchTable()" placeholder="Seri No Ara...">
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label class="label" class="form-label" for="marka">Marka</label>
                    <select class="form-control" name="tier_marka" id="search_marka" onchange="searchTables()" required>
                        <option value="" selected>Tümü</option>
                        <?php
                        // Veritabanından marka bilgilerini al
                        $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
                        if ($conn->connect_error) {
                            die("Bağlantı hatası: " . $conn->connect_error);
                        }

                        $sql = "SELECT  marka FROM lastik_info WHERE marka IS NOT NULL";
                        $result = $conn->query($sql);

                        // Sonuçları kontrol et ve option etiketlerini oluştur
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {
                                echo "<option value='" . $row['marka'] . "'>" . $row['marka'] . "</option>";
                            }
                        } else {
                            echo "<option value=''>Veritabanında marka bulunamadı</option>";
                        }

                        // Veritabanı bağlantısını kapat
                        $conn->close();
                        ?>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <table id="tireTable" class="table table-hover text-center">
        <thead class="table-dark">
            <tr>
                <th>Pozisyon</th>
                <th>Seri Numarası</th>
                <th>Marka</th>
                <th>Desen</th>
                <th>Ölçü</th>
                <th>Dış Derinlik</th>
                <th>Durum</th>
                <th>Ölçüm Tarihi</th>
                <th>Ölçüm KM</th>
                <th></th> <!-- Action butonu için eklenen sütun -->
            </tr>
        </thead>
        <tbody>
            <!-- Tablo içeriği burada üretilecek -->
            <?php
            require_once('database/db_conn.php');

            $car_id = $_GET['car_id'];

            $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

            if ($conn->connect_error) {
                die("Bağlantı hatası: " . $conn->connect_error);
            }

            $sql = "SELECT td.tire_id, td.tire_position, td.tire_serino, td.tire_marka, td.tire_desen, td.tire_olcu, td.tire_disderinligi, td.tire_durum, td.tire_olcumtarihi, td.tire_olcumkm,  td.created_by, td.created_date
            FROM tires t
            JOIN tire_details td ON t.tire_id = td.tire_id
            WHERE t.car_id IS NULL";

            $result = $conn->query($sql);

            if ($result !== false && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . $row['tire_position'] . "</td>";
                    echo "<td>" . $row['tire_serino'] . "</td>";
                    echo "<td>" . $row['tire_marka'] . "</td>";
                    echo "<td>" . $row['tire_desen'] . "</td>";
                    echo "<td>" . $row['tire_olcu'] . "</td>";
                    echo "<td>" . $row['tire_disderinligi'] . "</td>";
                    echo "<td>" . $row['tire_durum'] . "</td>";
                    echo "<td>" . $row['tire_olcumtarihi'] . "</td>";
                    echo "<td>" . $row['tire_olcumkm'] . "</td>";
                    echo "<td><button onclick=\"addTireToCar(" . $row['tire_id'] . ", $car_id)\" class=\"btn cur-p btn-outline-warning\">Araca Ekle</button></td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='9'>Depodan uygun lastik bulunamadı.</td></tr>";
            }

            $conn->close();
            ?>
            <?php
// log_functions.php dosyası

function logToDatabase($message) {
    // Veritabanına bağlanma işlemi
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
    
    // Bağlantı hatasını kontrol etme
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    // Log verisini veritabanına ekleme işlemi
    $timestamp = date("Y-m-d H:i:s");
    $sql = "INSERT INTO logs (timestamp, message) VALUES ('$timestamp', '$message')";

    if ($conn->query($sql) === TRUE) {
        echo "Log başarıyla kaydedildi.";
    } else {
        echo "Hata: " . $sql . "<br>" . $conn->error;
    }

    // Veritabanı bağlantısını kapatma işlemi
    $conn->close();
}
?>
        </tbody>
    </table>
</div>

<script>
    function addTireToCar(tire_id, car_id) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "update_tire_to_car.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                location.reload();
            }
        };
        xhr.send("tire_id=" + tire_id + "&car_id=" + car_id);
    }

    function searchTable() {
        var input = document.getElementById("searchInput");
        var filter = input.value.toUpperCase();
        var table = document.getElementById("tireTable");
        var tr = table.getElementsByTagName("tr");
        for (var i = 0; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td")[1];
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

    function searchTables() {
        var input = document.getElementById("search_marka");
        var filter = input.value.toUpperCase();
        var table = document.getElementById("tireTable");
        var tr = table.getElementsByTagName("tr");
        for (var i = 0; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td")[2];
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



<script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
<script type="text/javascript" src="js/jquery-2.2.4.min.js"></script>
<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="js/jszip.min.js"></script>
<script type="text/javascript" src="js/pdfmake.min.js"></script>
<script type="text/javascript" src="js/vfs_fonts.js"></script>
<script type="text/javascript" src="js/buttons.html5.min.js"></script>
<script type="text/javascript" src="js/buttons.print.min.js"></script>
<script type="text/javascript" src="js/app.js"></script>
<script type="text/javascript" src="js/jquery.mark.min.js"></script>
<script type="text/javascript" src="js/datatables.mark.js"></script>
<script type="text/javascript" src="js/buttons.colVis.min.js"></script>
</body>
</html>
