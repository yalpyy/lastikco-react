<!DOCTYPE html>
<html lang="en">

<?php include 'menu/navbar.php'; ?>

<head>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* Tablo stilini burada belirleyebilirsiniz */
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        th {
            background-color: #f2f2f2;
            color: black;
        }

        /* Pasta grafiği için container stilini burada belirleyebilirsiniz */
        #pie-chart-container {
            width: 400px;
            height: 400px;
            margin: 20px auto;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
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
    <link rel="stylesheet" href="css/custom.css" />

</head>

<body class="dashboard dashboard_1">
    <div class="full_container">
        <div class="inner_container">


            <!-- right content -->
            <div id="content">
                <!-- topbar -->
                <div class="topbar">
                    <nav class="navbar navbar-expand-lg navbar-light">
                        <div class="full">
                            <button type="button" id="sidebarCollapse" class="sidebar_toggle"><i class="fa fa-bars"></i></button>
                            <div class="logo_section">
                                <a href="index.html"><img class="img-responsive" src="images/logo/logo.png" alt="#" /></a>
                            </div>
                            <div class="right_topbar">
                                <div class="icon_info">
                                    <ul>
                                        <li><a href="#"><i class="fa fa-bell-o"></i><span class="badge">2</span></a></li>
                                        <li><a href="#"><i class="fa fa-question-circle"></i></a></li>
                                        <li><a href="#"><i class="fa fa-envelope-o"></i><span class="badge">3</span></a></li>
                                    </ul>
                                    <ul class="user_profile_dd">
                                        <li>
                                            <a class="dropdown-toggle" data-toggle="dropdown"><img class="img-responsive rounded-circle" src="images/layout_img/user_img.jpg" alt="#" /><span class="name_user"> <?php echo $usernames ?></span></a>
                                            <div class="dropdown-menu">
                                                <a class="dropdown-item" href="index.php">Dashboard</a>

                                                <a class="dropdown-item" href="destek.php">Help</a>
                                                <a class="dropdown-item" href="login/logout.php"><span>Log Out</span> <i class="fa fa-sign-out"></i></a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <!-- end topbar -->
                <!-- dashboard inner -->
                <div class="midde_cont">
                    <div class="container-fluid">
                        <div class="row column_title">
                            <div class="col-md-12">
                                <div class="page_title">
                                    <h2>Toplam Lastik</h2>
                                </div>
                            </div>
                        </div>

                    </div>

                    <?php
                    // Veritabanı bağlantısını oluştur
                    $conn = new mysqli($servername, $username, $password, $dbname);

                    // Bağlantıyı kontrol et
                    if ($conn->connect_error) {
                        die("Veritabanı bağlantısında hata: " . $conn->connect_error);
                    }

                    // Arama sorgusu için lastik_durum bilgilerini çekme sorgusu
                    $sql_search = "SELECT DISTINCT tire_durum FROM (SELECT tire_durum FROM tire_details UNION ALL SELECT tire_durum FROM lastik_havuz) AS combined";
                    $result_search = $conn->query($sql_search);

                    // Veritabanından lastik bilgilerini çekme sorgusu (tire_details)
                    $sql_tire_details = "SELECT tire_id, tire_serino, tire_marka, tire_desen, tire_durum, firma FROM tire_details";
                    $result_tire_details = $conn->query($sql_tire_details);

                    // Veritabanından lastik bilgilerini çekme sorgusu (lastik_havuz)
                    $sql_lastik_havuz = "SELECT tire_id, tire_serino, tire_marka, tire_desen, tire_durum, firma FROM lastik_havuz";
                    $result_lastik_havuz = $conn->query($sql_lastik_havuz);

                    // Verileri tablo şeklinde ekrana bastırma
                    if ($result_tire_details->num_rows > 0 || $result_lastik_havuz->num_rows > 0) {
                        echo "<table id='lastik-tablosu'><thead><tr><th>Tire ID</th><th>Tire Seri No</th><th>Tire Marka</th><th>Tire Desen</th><th>Tire Durum</th><th>Firma</th></tr></thead><tbody>";
                        // tire_details tablosundan gelen her satır için
                        while ($row = $result_tire_details->fetch_assoc()) {
                            echo "<tr><td>" . $row["tire_id"] . "</td><td>" . $row["tire_serino"] . "</td><td>" . $row["tire_marka"] . "</td><td>" . $row["tire_desen"] . "</td><td>" . $row["tire_durum"] . "</td><td>" . $row["firma"] . "</td></tr>";
                            // Her bir durumda kaç lastik olduğunu hesapla ve ekrana bastır
                            if (!isset($tireCount[$row["tire_durum"]])) {
                                $tireCount[$row["tire_durum"]] = 1;
                            } else {
                                $tireCount[$row["tire_durum"]] += 1;
                            }
                        }
                        // lastik_havuz tablosundan gelen her satır için
                        while ($row = $result_lastik_havuz->fetch_assoc()) {
                            echo "<tr><td>" . $row["tire_id"] . "</td><td>" . $row["tire_serino"] . "</td><td>" . $row["tire_marka"] . "</td><td>" . $row["tire_desen"] . "</td><td>" . $row["tire_durum"] . "</td><td>" . $row["firma"] . "</td></tr>";
                            // Her bir durumda kaç lastik olduğunu hesapla ve ekrana bastır
                            if (!isset($tireCount[$row["tire_durum"]])) {
                                $tireCount[$row["tire_durum"]] = 1;
                            } else {
                                $tireCount[$row["tire_durum"]] += 1;
                            }
                        }
                        echo "</tbody></table>";
                    } else {
                        echo "Veritabanında kayıtlı lastik bulunamadı.";
                    }

                    echo "<select id='search-select'>";
                    echo "<option value=''>Tüm Durumlar</option>";
                    if ($result_search->num_rows > 0) {
                        while ($row_search = $result_search->fetch_assoc()) {
                            echo "<option value='" . $row_search["tire_durum"] . "'>" . $row_search["tire_durum"] . "</option>";
                        }
                    }
                    echo "</select>";

                    $sql_durum = "SELECT tire_durum, COUNT(*) AS count FROM (SELECT tire_durum FROM tire_details UNION ALL SELECT tire_durum FROM lastik_havuz) AS combined GROUP BY tire_durum";
                    $result_durum = $conn->query($sql_durum);

                    $labels = [];
                    $data = [];
                    if ($result_durum->num_rows > 0) {
                        while ($row = $result_durum->fetch_assoc()) {
                            $labels[] = $row["tire_durum"];
                            $data[] = $row["count"];
                        }
                    }

                    $conn->close();
                    ?>

                    <!-- Pasta grafiği için container -->
                    <div id="pie-chart-container">
                        <canvas id="pie-chart"></canvas>
                    </div>

                    <!-- Durumlardaki lastik sayılarını gösteren tablo -->
                    <table id="durum-tablosu">
                        <thead>
                            <tr>
                                <th>Lastik Durumu</th>
                                <th>Lastik Sayısı</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            foreach ($tireCount as $status => $count) {
                                echo "<tr><td>$status</td><td>$count</td></tr>";
                            }
                            ?>
                        </tbody>
                    </table>

                    <script>
                        // Pasta grafiği verileri
                        var data = {
                            labels: <?php echo json_encode($labels); ?>,
                            datasets: [{
                                data: <?php echo json_encode($data); ?>,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(153, 102, 255, 0.5)',
                                    'rgba(255, 159, 64, 0.5)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        };

                        // Pasta grafiği oluşturma
                        var ctx = document.getElementById('pie-chart').getContext('2d');
                        var myPieChart = new Chart(ctx, {
                            type: 'pie',
                            data: data
                        });

                        // Arama özelliği
                        document.getElementById('search-select').addEventListener('change', function() {
                            var selectedValue = this.value;
                            var table = document.getElementById('lastik-tablosu');
                            var rows = table.getElementsByTagName('tr');
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                var cells = row.getElementsByTagName('td');
                                var showRow = false;
                                for (var j = 0; j < cells.length; j++) {
                                    var cell = cells[j];
                                    if (cell.innerHTML === selectedValue || selectedValue === '') {
                                        showRow = true;
                                        break;
                                    }
                                }
                                if (showRow) {
                                    row.style.display = '';
                                } else {
                                    row.style.display = 'none';
                                }
                            }
                        });
                    </script>
                </div>
                <!-- end dashboard inner -->
            </div>
        </div>
    </div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="js/jquery.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
    <script>
        $(document).ready(function() {
            $('#lastik-tablosu').DataTable({
                paging: true, // Pagination'ı etkinleştir
                pageLength: 10 // Sayfa başına gösterilecek öğe sayısını belirle (isteğe bağlı)
            });
        });
    </script>
    <script src="js/animate.js"></script>
    <script src="js/bootstrap-select.js"></script>
    <script src="js/owl.carousel.js"></script>
    <script src="js/perfect-scrollbar.min.js"></script>
    <script>
        var ps = new PerfectScrollbar('#sidebar');
    </script>
    <script src="js/chart_custom_style1.js"></script>
    <script src="js/custom.js"></script>
    <script>
        function redirectToTotalCars() {
            window.location.href = 'toplam_arac.php';
        }
    </script>
</body>

</html>
