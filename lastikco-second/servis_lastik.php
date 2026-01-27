<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php';
include "database/db_conn.php"; ?>

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
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/responsive.css" />
    <link rel="stylesheet" href="css/colors.css" />
    <link rel="stylesheet" href="css/bootstrap-select.css" />
    <link rel="stylesheet" href="css/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.1.2/css/buttons.dataTables.min.css">
</head>

<body class="dashboard dashboard_1">
    <div class="full_container">
        <div class="inner_container">
            <div id="content">
              
                <div class="midde_cont">
                    <div class="container-fluid">
                        <div class="row column_title">
                            <div class="col-md-12">
                                <div class="page_title">
                                    <h2> Servisteki Lastikler</h2>
                                </div>
                            </div>
                            <?php
                            require_once('database/db_conn.php');

                            if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['depoya_gonder'])) {

                                $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

                                if ($conn->connect_error) {
                                    die("Bağlantı hatası: " . $conn->connect_error);
                                }
                                $tire_id = $_POST['tire_id'];

                                $sql_update = "UPDATE lastik_havuz SET tire_durum = 'kullanılabilir' WHERE tire_id = ?";
                                $stmt_update = $conn->prepare($sql_update);
                                $stmt_update->bind_param("i", $tire_id);

                                if ($stmt_update->execute()) {

                                    $sql_select = "SELECT * FROM lastik_havuz WHERE tire_id = ?";
                                    $stmt_select = $conn->prepare($sql_select);
                                    $stmt_select->bind_param("i", $tire_id);
                                    $stmt_select->execute();
                                    $result_select = $stmt_select->get_result();

                                    if ($result_select->num_rows > 0) {
                                        $row = $result_select->fetch_assoc();

                                        $sql_insert = "INSERT INTO tire_details (tire_id, tire_serino, tire_marka, tire_desen, tire_olcu, tire_disderinligi, tire_durum, tire_olcumtarihi, created_by, created_date) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                        $stmt_insert = $conn->prepare($sql_insert);
                                        $stmt_insert->bind_param("isssssssss", $row['tire_id'], $row['tire_serino'], $row['tire_marka'], $row['tire_desen'], $row['tire_olcu'], $row['tire_disderinligi'], $row['tire_durum'], $row['tire_olcumtarihi'], $row['created_by'], $row['created_date']);

                                        if ($stmt_insert->execute()) {
                                            // Log kaydı oluşturma
                                            $log_message = "Lastik (ID: " . $row['tire_id'] . ") depoya gönderildi.";
                                            $log_timestamp = date('Y-m-d H:i:s');
                                            $sql_log = "INSERT INTO logs (timestamp, message) VALUES (?, ?)";
                                            $stmt_log = $conn->prepare($sql_log);
                                            $stmt_log->bind_param("ss", $log_timestamp, $log_message);
                                            $stmt_log->execute();

                                            $sql_delete = "DELETE FROM lastik_havuz WHERE tire_id = ?";
                                            $stmt_delete = $conn->prepare($sql_delete);
                                            $stmt_delete->bind_param("i", $tire_id);

                                            if ($stmt_delete->execute()) {
                                                echo '<div class="alert alert-success">Lastik detayları başarıyla tire_details tablosuna taşındı ve lastik_havuz tablosundan silindi.</div>';
                                            } else {
                                                echo "Lastik detayları taşındı ancak lastik_havuz tablosundan silinemedi: " . $conn->error;
                                            }
                                        } else {
                                            echo "Hata: " . $stmt_insert->error;
                                        }
                                        $stmt_insert->close();
                                    } else {
                                        echo "Lastik bulunamadı.";
                                    }
                                } else {
                                    echo "Hata: " . $stmt_update->error;
                                }
                                $conn->close();
                            }
                            ?>
                        </div>
                        <div name="Formundivi">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for="search_Input" class="form-label">Seri No Filtresi </label>
                                    <input type="text" id="searchInput" onkeyup="searchTable()" placeholder="Seri No Ara...">
                                </div>

                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label for="search_durum" class="form-label">Durum Filtresi </label>
                                    <select id="search_durum" onchange="searchTables()" class="form-control">
                                        <option value="">Tümü</option>
                                        <option value="kaplama">Kaplama</option>
                                        <option value="tamirli">Tamirli</option>
                                        <option value="stepne">Stepne</option>
                                        <option value="çıkma lastik">Çıkma Lastik</option>
                                        <option value="hurda">Hurda</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <?php
                        $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

                        if ($conn->connect_error) {
                            die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
                        }
                        $sql = "SELECT * FROM lastik_havuz";

                        $result = $conn->query($sql);

                        ?>
                        <div class="mb-3">
                        </div>
                        <table id="lastiks" class="table table-hover text-center">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Seri No</th>
                                    <th>Marka</th>
                                    <th>Desen</th>
                                    <th>Ölçü</th>
                                    <th>Diş Derinliği</th>
                                    <th>Durum</th>
                                    <th>Ölçüm Tarihi</th>
                                    <th>Oluşturan</th>
                                    <th>Oluşturma Tarihi</th>
                                    <th>Depoya Gönder</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php

                                if ($result !== false && $result->num_rows > 0) {
                                    while ($row = $result->fetch_assoc()) {
                                ?>
                                        <tr>
                                            <td><?php echo $row['tire_id']; ?></td>
                                            <td><?php echo $row['tire_serino']; ?></td>
                                            <td><?php echo $row['tire_marka']; ?></td>
                                            <td><?php echo $row['tire_desen']; ?></td>
                                            <td><?php echo $row['tire_olcu']; ?></td>
                                            <td><?php echo $row['tire_disderinligi']; ?></td>
                                            <td><?php echo $row['tire_durum']; ?></td>
                                            <td><?php echo $row['tire_olcumtarihi']; ?></td>
                                            <td><?php echo $row['created_by']; ?></td>
                                            <td><?php echo $row['created_date']; ?></td>
                                            <td>
                                                <form method="post">
                                                    <input type="hidden" name="tire_id" value="<?php echo $row['tire_id']; ?>">
                                                    <button type="submit" name="depoya_gonder" class="btn btn-danger">Depoya Gönder</button>
                                                </form>
                                            </td>
                                        </tr>
                                <?php
                                    }
                                } else {
                                    echo "<tr><td colspan='11'>Kayıt bulunamadı.</td></tr>";
                                }
                                $conn->close();
                                ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="container-fluid">
                        <div class="footer">
                            <p>Copyright © 2024 Designed by LASTIKCO. All rights reserved.<br><br>

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/jquery.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/animate.js"></script>
    <script src="js/bootstrap-select.js"></script>
    <script src="js/owl.carousel.js"></script>
    <script src="js/Chart.min.js"></script>
    <script src="js/Chart.bundle.min.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/analyser.js"></script>
    <script src="js/perfect-scrollbar.min.js"></script>
    <script>
        var ps = new PerfectScrollbar('#sidebar');
    </script>
    <script src="js/chart_custom_style1.js"></script>
    <script src="js/custom.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
    
    <script>
        $(document).ready(function() {
            $('#lastiks').DataTable({
                searching: true,
                dom: 'Bfrtip',
                buttons: ['excel', 'pdf'],
                pageLength: 10
            });
        });

        function searchTable() {
            var input = document.getElementById("searchInput");
            var filter = input.value.toUpperCase();

            var table = document.getElementById("lastiks");
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
            var input = document.getElementById("search_durum");
            var filter = input.value.toUpperCase();

            var table = document.getElementById("lastiks");
            var tr = table.getElementsByTagName("tr");
            for (var i = 0; i < tr.length; i++) {
                var td = tr[i].getElementsByTagName("td")[6];
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
