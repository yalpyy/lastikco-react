<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php'; ?>
<?php

include "database/db_conn.php";

// Pagination settings
$records_per_page = 10;
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? $_GET['page'] : 1;

$search_conditions = [];

if (!empty($_GET['car_name'])) {
    $search_conditions[] = "car_name LIKE '%" . mysqli_real_escape_string($conn, $_GET['car_name']) . "%'";
}

if (!empty($_GET['car_model'])) {
    $search_conditions[] = "car_model LIKE '%" . mysqli_real_escape_string($conn, $_GET['car_model']) . "%'";
}

if (!empty($_GET['created_by'])) {
    $search_conditions[] = "created_by LIKE '%" . mysqli_real_escape_string($conn, $_GET['created_by']) . "%'";
}

// SQL sorgusu oluşturma
$sql = "SELECT * FROM cars WHERE durum = 1";

if (!empty($search_conditions)) {
    $sql .= " WHERE " . implode(" AND ", $search_conditions);
}

$sort_sql = '';
$sort = isset($_GET['sort']) ? $_GET['sort'] : '';
if ($sort == 'date_desc') {
    $sort_sql = ' ORDER BY created_date DESC';
} elseif ($sort == 'date_asc') {
    $sort_sql = ' ORDER BY created_date ASC';
}

$sql .= $sort_sql;

$result = mysqli_query($conn, $sql);
$total_records = mysqli_num_rows($result);
$total_pages = ceil($total_records / $records_per_page);

// Calculate the offset for the query
$offset = ($page - 1) * $records_per_page;

// Add LIMIT and OFFSET to the query
$sql .= " LIMIT $offset, $records_per_page";

$result = mysqli_query($conn, $sql);
?>
<?php
// Veritabanı bağlantısı
include "database/db_conn.php";

// Formdan gelen verileri işle
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['pasif_gonder'])) {

    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

    // Bağlantı hatasını kontrol et
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    // Post verilerini al
    $carId = $_POST["carId"];
   
    // Durumu güncelle
    $updateSql = "UPDATE cars SET durum = 0 WHERE car_id = '$carId'";
    if (mysqli_query($conn, $updateSql)) {
        echo "Durum başarıyla güncellendi.";
    } else {
        echo "Durum güncellenirken bir hata oluştu: " . mysqli_error($conn);
    }
} else {
    echo "Geçersiz istek.";
}
?>


<head>
    <!-- basic -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- mobile metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <!-- site metas -->
    <title>Lastik.co Anasayfa </title>
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

    <!-- site css -->
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- responsive css -->
    <link rel="stylesheet" href="css/dataTables.bootstrap4.min.css" />
    <!-- color css -->

    <!-- custom css -->
    <link rel="stylesheet" href="css/table.css" />
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
      <![endif]-->
</head>

<body class="dashboard dashboard_1">
    <div class="full_container">
        <div class="inner_container">
            <!-- Sidebar  -->

            <!-- end sidebar -->
            <!-- right content -->
            <div id="content">
               
                <!-- dashboard inner -->
                <div class="midde_cont">
                    <div class="container-fluid">
                        <div class="row column_title">
                            <div class="col-md-12">
                                <div class="page_title">
                                    <h2>Aktif Araçlar</h2>
                                </div>
                            </div>
                        </div>
                        <!-- Baslangıc -->

                        <div>
                            <?php
        if (isset($_GET["msg"])) {
            $msg = $_GET["msg"];
            echo '<div class="alert alert-warning alert-dismissible fade show" role="alert">
                  ' . $msg . '
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
        }
        ?>

                            <div class="mb-3">
                            <div class="col-md-3">
    <div class="form-group">
        <label for="searchInput" class="form-label">Plaka </label>
        <input type="text" id="searchInput" onkeyup="searchTable()" placeholder="Plaka Ara...">
    </div>
</div>

                               
                            </div>

                            <a href="newcar.php" class="btn btn-dark mb-3">Yeni Araç Kaydı</a>

                            <table id="araclar" class="table table-hover text-center">
                                <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Araç Numara</th>
                                        <th scope="col">Araç Plaka</th>
                                        <th scope="col">Araç Model</th>
                                        <th scope="col">Araç Bölgesi</th>
                                        <th scope="col">Oluşturan</th>
                                        <th scope="col">
                                            Oluşturma Tarihi
                                            <?php
                // Tarih sıralama için ok simgeleri ekleyelim
                $date_asc_link = '?page=' . $page . '&sort=date_asc';
                $date_desc_link = '?page=' . $page . '&sort=date_desc';
                ?>
                                            <a href="<?php echo $date_desc_link; ?>"><i
                                                    class="fas fa-arrow-down"></i></a>
                                            <a href="<?php echo $date_asc_link; ?>"><i
                                                    class="fas fa-arrow-up"></i></a>
                                        </th>
                                        <th scope="col">Detay/Sil/Akü İşlemi</th>
                                        <th scope="col">Bölge Değiştir</th>
                                        <th scope="col">Durum Değiştir</th>
                                      
                                    </tr>
                                </thead>
                                <tbody>

                                    <?php
        while ($row = mysqli_fetch_assoc($result)) {
            $car_id = $row["car_id"];
            $axlesSql = "SELECT axle_count FROM axles WHERE car_id = '$car_id'";
            $axlesResult = $conn->query($axlesSql);

            if ($axlesResult->num_rows > 0) {
                $axlesRow = $axlesResult->fetch_assoc();
                $axle_count = $axlesRow['axle_count'];

                ?>
                                    <tr>
                                        <td><?php echo $row["car_id"] ?></td>
                                        <td><?php echo $row["car_name"] ?></td>
                                        <td><?php echo $row["car_model"] ?></td>
                                        <td><?php echo $row["arac_bolgesi"] ?></td>
                                        <td><?php echo $row["created_by"] ?></td>
                                        <td><?php echo $row["created_date"] ?></td>
                                        <td>
                                            <?php
                        if ($axle_count == 2) {
                            ?>
                                            <a href="caredit.php?car_id=<?php echo $row["car_id"] ?>"
                                                class="link-dark">
                                                <i class="fa-solid fa-pen-to-square fs-5 me-3"></i>
                                            </a>
                                            <?php
                        } elseif ($axle_count == 3) {
                            ?>
                                            <a href="caredit2.php?car_id=<?php echo $row["car_id"] ?>"
                                                class="link-dark">
                                                <i class="fa-solid fa-pen-to-square fs-5 me-3"></i>
                                            </a>

                                            <?php
                        } elseif ($axle_count == 4) {
                            ?>
                                            <a href="caredit3.php?car_id=<?php echo $row["car_id"] ?>"
                                                class="link-dark">
                                                <i class="fa-solid fa-pen-to-square fs-5 me-3"></i>
                                            </a>
                                            <?php
                        }
                        ?>
                                            <a href="deletecar.php?car_id=<?php echo $row["car_id"] ?>"
                                                class="link-dark">
                                                <i class="fa-solid fa-trash fs-5"></i>
                                            </a>
                                            <a href="akuedit.php?car_id=<?php echo $row["car_id"] ?>"
                                                class="link-dark">
                                                <i class="fas fa-plug fs-5 me-1"></i> </a>
                                                
                                        </td>
                                        <td>
                                        <button class="btn fa fa-flag" onclick="openPopup('aracbolge.php?car_id=<?php echo $car_id ?>',300,200)"></button>
                                        </td>
                                        <td>
                                        <form method="post">
                                        <input type="hidden" name="carId" value="<?php echo $row['car_id']; ?>">
                                        <button type="submit" name="pasif_gonder" class="btn btn-danger">Pasif Yap</button>

                        </form>
                                        </td>
                                      </tr>
                                    
                                    <?php
            }
        }
        ?>

                                </tbody>
                            </table>

                            <nav aria-label="Page navigation example">
                                <ul class="pagination">
                                    <?php
                for ($i = 1; $i <= $total_pages; $i++) {
                    echo "<li class='page-item'><a class='page-link' href='?page=$i'>$i</a></li>";
                }
                ?>
                                </ul>
                            </nav>
                        </div>

                    </div>
                    <!-- Bitis -->
                </div>

                <!-- footer -->
                <div class="container-fluid">
                    <div class="footer">
                        <p>Copyright © 2024 Designed by LASTIKCO All rights reserved.<br><br>

                        </p>
                    </div>
                </div>
            </div>
            <!-- end dashboard inner -->
        </div>
    </div>
   

    <!-- jQuery -->
    <script>
       
        function openPopup(url, width, height) {
    // Pop-up penceresini aç
    window.open(url, 'Arac Bolge Değiştir', 'scrollbars=yes,resizable=no,width=' + width + ',height=' + height);
}

        
    </script>
    <script>
        function searchTable() {
    var input = document.getElementById("searchInput");
    var filter = input.value.toUpperCase();

    var table = document.getElementById("araclar");
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

        
    </script>
    
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
    
</script>
</body>

</html>