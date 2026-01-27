<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php'; 
require_once('database/db_conn.php');?>
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
      <link rel="stylesheet" href="css/custom.css" />
     
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
                              <h2>Alarm Durumları</h2>
                           </div>
                        </div>
                     </div>
                 <!-- ALERT BAŞLANGIÇ-->
<div class="col-md-12">
    <div class="white_shd full margin_bottom_30">
        <div class="full graph_head">
            <div class="heading1 margin_0">
                <h2>Bildirimler </h2>
            </div>
        </div>
        <div class="full progress_bar_inner">
            <div class="row">
                <div class="col-md-12">
                    <div class="msg_section">
                        <div class="msg_list_main">
                            <ul class="msg_list">
                                <?php
                                // Veritabanı bağlantısını oluşturma
                                $conn = new mysqli($servername, $username, $password, $dbname);

                                // Bağlantıyı kontrol etme
                                if ($conn->connect_error) {
                                    die("Veritabanı bağlantısında hata: " . $conn->connect_error);
                                }

                                // Dis derinligi tablosundan tire_disderinligi değeri 8'den küçük olan verileri çekme
                                $sql = "SELECT dis_derinligi.tire_id, dis_derinligi.tire_disderinligi, cars.car_name 
                                    FROM dis_derinligi 
                                    INNER JOIN tires ON dis_derinligi.tire_id = tires.tire_id 
                                    INNER JOIN cars ON tires.car_id = cars.car_id 
                                    WHERE dis_derinligi.tire_disderinligi < 8";

                                $result = $conn->query($sql);

                                if ($result->num_rows > 0) {
                                    while($row = $result->fetch_assoc()) {
                                        echo '<li><span><span class="name_user">Araç Plakası: '.$row["car_name"].'</span><span class="msg_user">Lastik Numarası: '.$row["tire_id"].', Diş Derinliği: '.$row["tire_disderinligi"].'</li>';
                                    }
                                } else {
                                    echo '<li><span>Veri Bulunamadı </span></li>';
                                }
                                $conn->close();
                                ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ALERT BİTİŞ -->


                     </div>
                    


                    





                        
                     <!-- graph -->
                     
                     <!-- end graph -->
                     
                  </div>
                  <!-- footer -->
                 
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
    function redirectToAlert() {
        // Yönlendirme işlemi
        window.location.href = 'alert.php';
    }
</script>
   </body>
</html>