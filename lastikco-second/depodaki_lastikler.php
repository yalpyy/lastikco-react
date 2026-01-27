<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php'; ?>
   <head>
      <!-- basic -->
     
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!-- mobile metas -->
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="viewport" content="initial-scale=1, maximum-scale=1">
      <!-- site metas -->
      <title>Admin Panel </title>
      <meta name="keywords" content="">
      <meta name="description" content="">
      <meta name="author" content="">
      <!-- site icon -->
      <link rel="icon" href="images/logo/logo_icon.png" type="image/png" />
      <!-- bootstrap css -->
      <link rel="stylesheet" href="css/bootstrap.min.css" />
      <!-- site css -->
      <link rel="stylesheet" href="style.css" />
      <!-- responsive css -->
      <link rel="stylesheet" href="css/responsive.css" />
      <!-- color css -->
      <link rel="stylesheet" href="css/colors.css" />
      <!-- select bootstrap -->
      <link rel="stylesheet" href="css/bootstrap-select.css" />
      <!-- scrollbar css -->
      <link rel="stylesheet" href="css/perfect-scrollbar.css" />
      <!-- custom css -->
      
      <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
    <!-- JavaScript -->
    <script src="js/jquery.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
    <script src="js/app.js"></script>
      
   
    <!-- JavaScript -->

     
   </head>
   <body class="dashboard dashboard_1">
      <div class="full_container">
         <div class="inner_container">
            
           
            <!-- right content -->
            <div id="content">
              
               <!-- dashboard inner -->
               <div class="midde_cont">
                  <div class="container-fluid">
                     <div class="row column_title">
                        <div class="col-md-12">
                           <div class="page_title">
                              <h2>Depodaki Lastikler</h2>
                           </div>
                        </div>
                     </div>
                    
                     </div>
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
                            if ($result->num_rows > 0) {
                                while ($row = $result->fetch_assoc()) {
                                    echo "<option value='" . $row['marka'] . "'>" . $row['marka'] . "</option>";
                                }
                            } else {
                                echo "<option value=''>Veritabanında marka bulunamadı</option>";
                            }
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
                <?php
                // Veritabanı bağlantı bilgilerini içe aktar
                require_once('database/db_conn.php');
                // Aracın car_id değerini al
                $car_id = $_GET['car_id'] ?? null;
                // Veritabanı bağlantısını oluştur
                $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
                if ($conn->connect_error) {
                    die("Bağlantı hatası: " . $conn->connect_error);
                }
                // Lastikleri veritabanından getir
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
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='9'>Depodan uygun lastik bulunamadı.</td></tr>";
                }
                $conn->close();
                ?>
            </tbody>
        </table>
    </div>

    <script>
    

        function searchTable() {
            var input = document.getElementById("searchInput");
            var filter = input.value.toUpperCase();
            var table = document.getElementById("tireTable");
            var tr = table.getElementsByTagName("tr");
            for (var i = 0; i < tr.length; i++) {
                var td = tr[i].getElementsByTagName("td")[1];
                if (td) {
                    var txtValue = td.textContent || td.innerText;
                    if (txt                    Value.toUpperCase().indexOf(filter) > -1) {
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















                        
                     <!-- graph -->
                     
                     <!-- end graph -->
                     
                
               </div>
               <!-- end dashboard inner -->
            </div>
         </div>
      </div>
      <!-- jQuery -->
      <script src="js/jquery.min.js"></script>
      <script src="js/popper.min.js"></script>
      <script src="js/bootstrap.min.js"></script>
      <!-- wow animation -->
      <script src="js/animate.js"></script>
      <!-- select country -->
      <script src="js/bootstrap-select.js"></script>
      <!-- owl carousel -->
      <script src="js/owl.carousel.js"></script> 
      <!-- nice scrollbar -->
      <script src="js/perfect-scrollbar.min.js"></script>
      <script>
         var ps = new PerfectScrollbar('#sidebar');
      </script>
      <!-- custom js -->
      <script src="js/chart_custom_style1.js"></script>
      <script src="js/custom.js"></script>
      <script>
    function redirectToTotalCars() {
        // Yönlendirme işlemi
        window.location.href = 'toplam_arac.php';
    }
</script>

<script>
    function redirectToTotalTires() {
        // Yönlendirme işlemi
        window.location.href = 'toplam_lastik.php';
    }
</script>
<script>
    function redirectToAlert() {
        // Yönlendirme işlemi
        window.location.href = 'alert.php';
    }
</script>
   </body>
</html>