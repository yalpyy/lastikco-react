<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php';
require_once('database/db_conn.php'); ?>
   <head>
   <style>
    /* DataTables Buttons stil düzenlemesi */
    .dt-buttons {
        display: flex;
        gap: 10px;
    }

    .dt-button {
        background-color: #007bff; /* Arka plan rengi */
        color: #fff; /* Yazı rengi */
        border: none; /* Kenarlık yok */
        padding: 8px 12px; /* Dolgu */
        border-radius: 4px; /* Köşe yuvarlama */
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .dt-button:hover {
        background-color: #0056b3; /* Hover rengi */
    }
</style>
      <!-- basic -->
      <!-- basic -->
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!-- mobile metas -->
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="viewport" content="initial-scale=1, maximum-scale=1">

      <link rel="stylesheet" type="text/css" href="style.css">

      <!-- site metas -->
      <title>Lastik.co Anasayfa  </title>
      <meta name="keywords" content="">
      <meta name="description" content="">
      <meta name="author" content="">
      <!-- site icon -->
      <link rel="icon" href="images/fevicon.png" type="image/png" />
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
    

    <!-- DataTables Buttons CSS -->
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
                                    <a class="dropdown-toggle" data-toggle="dropdown"><img class="img-responsive rounded-circle" src="images/layout_img/user_img.jpg" alt="#" /><span class="name_user">Lastik.co</span></a>
                                    <div class="dropdown-menu">
                                       <a class="dropdown-item" href="profile.html">My Profile</a>
                                       <a class="dropdown-item" href="settings.html">Settings</a>
                                       <a class="dropdown-item" href="help.html">Help</a>
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
                              <h2>Akü Ekleme</h2>
                           </div>
                        </div>
                        <?php
// Veritabanı bağlantısını yapın
require_once('database/db_conn.php');

// Formdan gelen verileri işle
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['depoya_gonder'])) {
    // Veritabanı bağlantı bilgileri
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

    // Bağlantı hatasını kontrol et
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    // Lastik ID'sini al
    $tire_id = $_POST['tire_id'];

    // Lastik durumunu güncelle
    $sql_update = "UPDATE lastik_havuz SET tire_durum = 'kullanılabilir' WHERE tire_id = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("i", $tire_id);

    if ($stmt_update->execute()) {
        // Lastik bilgilerini alma
        $sql_select = "SELECT * FROM lastik_havuz WHERE tire_id = ?";
        $stmt_select = $conn->prepare($sql_select);
        $stmt_select->bind_param("i", $tire_id);
        $stmt_select->execute();
        $result_select = $stmt_select->get_result();
        
        if ($result_select->num_rows > 0) {
            $row = $result_select->fetch_assoc();

            // Lastik detaylarını tire_details tablosuna ekleme
            $sql_insert = "INSERT INTO tire_details (tire_id, tire_serino, tire_marka, tire_desen, tire_olcu, tire_disderinligi, tire_durum, tire_olcumtarihi, created_by, created_date) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt_insert = $conn->prepare($sql_insert);
            $stmt_insert->bind_param("isssssssss", $row['tire_id'], $row['tire_serino'], $row['tire_marka'], $row['tire_desen'], $row['tire_olcu'], $row['tire_disderinligi'], $row['tire_durum'], $row['tire_olcumtarihi'], $row['created_by'], $row['created_date']);

            if ($stmt_insert->execute()) {
                // Lastik detaylarını başarıyla ekledikten sonra lastik_havuz tablosundan silme
                $sql_delete = "DELETE FROM lastik_havuz WHERE tire_id = ?";
                $stmt_delete = $conn->prepare($sql_delete);
                $stmt_delete->bind_param("i", $tire_id);

                if ($stmt_delete->execute()) {
                    echo '<div class="alert alert-success">Lastik detayları başarıyla tire_details tablosuna taşındı ve lastik_havuz tablosundan silindi.</div>';
                } else {
                    
                    echo '<div class="alert alert-success">"Lastik detayları taşındı ancak lastik_havuz tablosundan silinemedi: "</div>'; . $conn->error;
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

    // Veritabanı bağlantısını kapat
    $conn->close();
}
?>
                     </div>
                     <!-- Baslangıc -->
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
        // Veritabanı bağlantı bilgileri
        $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

        // Bağlantı hatasını kontrol et
        if ($conn->connect_error) {
            die("Bağlantı hatası: " . $conn->connect_error);
        }

        // SQL sorgusu
        $sql = "SELECT * FROM lastik_havuz";

        // Sorguyu çalıştır
        $result = $conn->query($sql);

        // Sorgu sonuçlarını kontrol et ve tabloyu yazdır
        if ($result !== false && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>".$row['tire_id']."</td>";
                echo "<td>".$row['tire_serino']."</td>";
                echo "<td>".$row['tire_marka']."</td>";
                echo "<td>".$row['tire_desen']."</td>";
                echo "<td>".$row['tire_olcu']."</td>";
                echo "<td>".$row['tire_disderinligi']."</td>";
                echo "<td>".$row['tire_durum']."</td>";
                echo "<td>".$row['tire_olcumtarihi']."</td>";
                echo "<td>".$row['created_by']."</td>";
                echo "<td>".$row['created_date']."</td>";
                echo "<td>
                        <form method='post'>
                            <input type='hidden' name='tire_id' value='".$row['tire_id']."'>
                            <button type='submit' name='depoya_gonder' class='btn btn-danger'>Depoya Gönder</button>
                        </form>
                      </td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='11'>Kayıt bulunamadı.</td></tr>";
        }

        // Veritabanı bağlantısını kapat
        $conn->close();
        ?>
    </tbody>
</table>  



                    <!-- Bitis -->
                     </div>
                     
                  <!-- footer -->
                  <div class="container-fluid">
                     <div class="footer">
                        <p>Copyright © 2024 Designed by LASTIKCO. All rights reserved.<br><br>
                          
                        </p>
                     </div>
                  </div>
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
      <!-- chart js -->
      <script src="js/Chart.min.js"></script>
      <script src="js/Chart.bundle.min.js"></script>
      <script src="js/utils.js"></script>
      <script src="js/analyser.js"></script>
      <!-- nice scrollbar -->
      <script src="js/perfect-scrollbar.min.js"></script>
      <script>
         var ps = new PerfectScrollbar('#sidebar');
      </script>
      <!-- custom js -->
      <script src="js/custom.js"></script>
      <script src="js/chart_custom_style1.js"></script>
      <script src="js/custom.js"></script>
      <script src="js/chart_custom_style1.js"></script>
      <script src="js/jquery-3.3.1.slim.min.js"></script>
      <script src="js/bootstrap.bundle.min.js"></script>
      <script src="js/jquery.dataTables.min.js"></script>
      <script src="js/dataTables.bootstrap4.min.js"></script>
      <script src="js/table.js"></script>
   </body>
</html>