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
               <!-- topbar -->
             
               <!-- dashboard inner -->
               <div class="midde_cont">
                  <div class="container-fluid">
                     <div class="row column_title">
                        <div class="col-md-12">
                           <div class="page_title">
                              <h2>Anasayfa </h2>
                           </div>
                        </div>
                     </div>
                     <?php
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı hatası kontrolü
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL sorgusu
$sql = "SELECT COUNT(*) as total FROM cars";
$result = $conn->query($sql);

// Sorgu sonucunu kontrol et
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $total_cars = $row['total'];
    echo "Toplam veri sayısı: " . $total_cars;
} else {
    echo "Veri bulunamadı.";
}

// Veritabanı bağlantısını kapat
$conn->close();
?>

<?php

// Veritabanı bağlantısı oluşturma
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı hatası kontrolü
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL sorgusu
$sql = "SELECT COUNT(*) as total_tires FROM tires"; // lastik tablosundan toplam lastik sayısını alır

$result = $conn->query($sql);

// Sorgu sonucunu kontrol et
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $total_tires = $row['total_tires'];
    echo "Toplam lastik sayısı: " . $total_tires;
} else {
    echo "Lastik bulunamadı.";
}

// Veritabanı bağlantısını kapat
$conn->close();
?>

<?php

// Veritabanı bağlantısı oluşturma
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı hatası kontrolü
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL sorgusu
$sql = "SELECT COUNT(*) as count_disderinlik FROM dis_derinligi WHERE tire_disderinligi < 8"; 

$result = $conn->query($sql);

// Sorgu sonucunu kontrol et
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $count_disderinlik = $row['count_disderinlik'];
    echo "Tire_disderinligi değeri 8'den küçük olan kayıt sayısı: " . $count_disderinlik;
} else {
    echo "Kayıt bulunamadı.";
}

// Veritabanı bağlantısını kapat
$conn->close();
?>





<?php

// Veritabanı bağlantısı oluşturma
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı hatası kontrolü
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL sorgusu
$sql = "SELECT COUNT(*) AS total_null_car_id FROM tires WHERE car_id IS NULL";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $total_null_car_id = $row['total_null_car_id'];
    echo "Null olan car_id sayısı: " . $total_null_car_id;
} else {
    echo "Kayıt bulunamadı.";
}


// Veritabanı bağlantısını kapat
$conn->close();
?>


<?php

// Veritabanı bağlantısı oluşturma
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı hatası kontrolü
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL sorgusu
$sql = "SELECT COUNT(*) AS total_faulty_tires FROM tire_details WHERE tire_durum = 'Arızalı'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $total_faulty_tires = $row['total_faulty_tires'];
    echo "Arızalı lastik sayısı: " . $total_faulty_tires;
} else {
    echo "Kayıt bulunamadı.";
}



// Veritabanı bağlantısını kapat
$conn->close();
?><?php

// Veritabanı bağlantısı oluşturma
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı hatası kontrolü
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL sorgusu
$sql = "SELECT COUNT(*) AS total_batteries FROM aku";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $total_batteries = $row['total_batteries'];
    echo "Toplam akü sayısı: " . $total_batteries;
} else {
    echo "Kayıt bulunamadı.";
}



// Veritabanı bağlantısını kapat
$conn->close();
?>
                     <div class="row column1">
                        <!-- Counter Sections -->
                        <div class="col-md-6 col-lg-3">
                            <div class="full counter_section margin_bottom_30" onclick="redirectToTotalCars()">
                                <div class="couter_icon">
                                    <div>
                                        <i class="fa fa-car  blue1_color"></i>
                                    </div>
                                </div>
                                <div class="counter_no">
                                    <div>
                                        <p class="total_no"><?php echo $total_cars ?></p>
                                        <p class="head_couter">Toplam Araç</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Diğer counter seçenekleri -->
                        <div class="col-md-6 col-lg-3">
                        <div class="full counter_section margin_bottom_30" onclick="redirectToTotalTires()">
                                <div class="couter_icon">
                                    <div>
                                        <i class="fa fa-car  blue1_color"></i>
                                    </div>
                                </div>
                                <div class="counter_no">
                                    <div>
                                    <p class="total_no"><?php echo $total_tires ?></p>
                                    <p class="head_couter">Toplam Lastik</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                        <div class="full counter_section margin_bottom_30" onclick="redirectToAlert()">
                                <div class="couter_icon">
                                    <div>
                                        <i class="fa fa-car  blue1_color"></i>
                                    </div>
                                </div>
                                <div class="counter_no">
                                    <div>
                                    <p class="total_no"><?php echo $count_disderinlik ?></p>
                                    <p class="head_couter">Alert</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                           <div class="full counter_section margin_bottom_30">
                              <div class="couter_icon">
                                 <div> 
                                    <i class="fa fa-wrench green_color"></i>
                                 </div>
                              </div>
                              <div class="counter_no">
                                 <div>
                                    <p class="total_no"><?php echo $total_faulty_tires ?></p>
                                    <p class="head_couter">Hasarlı Lastik</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                           <div class="full counter_section margin_bottom_30">
                              <div class="couter_icon">
                                 <div> 
                                    <i class="fa fa-plug red_color"></i>
                                 </div>
                              </div>
                              <div class="counter_no">
                                 <div>
                                 <p class="total_no"><?php echo $total_batteries ?></p>
                                    <p class="head_couter">Toplam Akü</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div class="col-md-6 col-lg-3">
                           <div class="full counter_section margin_bottom_30">
                              <div class="couter_icon">
                                 <div> 
                                    <i class="fa fa-life-buoy red_color"></i>
                                 </div>
                              </div>
                              <div class="counter_no">
                                 <div>
                                    <p class="total_no"><?php echo $total_null_car_id ?></p>
                                    <p class="head_couter">Depodaki Lastik</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                           <div class="full counter_section margin_bottom_30">
                              <div class="couter_icon">
                                 <div> 
                                    <i class="fa fa-life-buoy red_color"></i>
                                 </div>
                              </div>
                              <div class="counter_no">
                                 <div>
                                    <p class="total_no"><?php echo $total_null_car_id ?></p>
                                    <p class="head_couter">Hasarlı Lastik</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                    
                        
                     <!-- graph -->
                     
                     <!-- end graph -->
                     
                  </div>
                  <!-- footer -->
                  <div class="container-fluid">
                     <div class="footer">
                        <p>Copyright © 2024 Designed by XXX.design. All rights reserved.<br><br>
                           Distributed By: 
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