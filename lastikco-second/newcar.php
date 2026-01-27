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
    <!-- site metas -->
    <title>Lastik.co Araç Takip</title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- site icon -->
    <link rel="icon" href="images/fevicon.png" type="image/png" />
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
            
                <!-- Input Box -->
                <div class="container-fluid">
                <div class="row column_title">
                        <div class="col-md-12">
                           <div class="page_title">
                              <h2>Araç Ekleme</h2>
                           </div>
                        </div>
                     </div>
                   
                           
                    </div>
                    <!-- dashboard inner -->
                    <div class="midde_cont" style="margin-top: 100px;">
                    
<?php

// Bağlantı kontrolü yapılır
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])) {

    $car_name = $_POST['car_name'];
    $car_model = $_POST['car_model'];
    $axle_count = $_POST['axle_count'];
    $arac_bolgesi = $_POST['arac_bolgesi'];

    // Araba tablosuna veri eklemek için SQL sorgusu hazırlanır
    $sql_car = "INSERT INTO cars (car_name, car_model,arac_bolgesi, created_by, created_date,durum) VALUES ('$car_name', '$car_model','$arac_bolgesi', '$usernames', NOW(),'1')";
    // Arabaya ait aks sayısını aks tablosuna eklemek için SQL sorgusu hazırlanır
    $sql_axle = "INSERT INTO axles (car_id, axle_count) VALUES (LAST_INSERT_ID(), $axle_count)";

    // Araba tablosuna veri eklenir
    if ($conn->query($sql_car) === TRUE) {
        // Arabanın eklenmesi başarılıysa, aks sayısı da aks tablosuna eklenir
        if ($conn->query($sql_axle) === TRUE) {
            echo '<div class="alert alert-success">Araç başarıyla Eklendi.</div>';
        } else {
            echo '<div class="alert alert-success">Akbilgileri eklenirken hata oluştu.</div>';
            echo ": " . $conn->error;
        }
    } else {
        echo '<div class="alert alert-success">Araç Eklenirken Hata Oldu.</div>';
        echo ": " . $conn->error;
    }
}

// Diğer form ve işlemler buraya eklenir

// Bağlantı kapatılır
$conn->close();
?>
                    
                    <form action="" method="post" class="addcarForm">   
                    <div class="row">
                    <div class="col-6 col-md-4"> <label class="input-group-text" for="car_name">Plaka  :</label></div>
                    <div class="col-6 col-md-4"> <label class="input-group-text" for="car_model">Model  :</label></div>
                    <div class="col-6 col-md-4"> <label class="input-group-text" for="axle_count">Aks/Dingil Sayısı  :</label></div>
                    </div>
                    <div class="row">
                    <div class="col">
                        <input type="text" id="car_name" name="car_name" class="form-control" required><br><br></div>
                    <div class="col"><input type="text" id="car_model" name="car_model" class="form-control" required></div>
                    <div class="col"><input type="number" id="axle_count" name="axle_count"class="form-control" required></div>
                    </div>
                    <div class="input-group-prepend">
                    <label class="input-group-text" for="arac_bolgesi">Araç Bölgesi   :</label>
                    </div>
                    <select class="form-control" id="arac_bolgesi" name="arac_bolgesi"  placeholder="Bölge Seçiniz.." required>
   <?php
   // Veritabanından marka bilgilerini al
   $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
   if ($conn->connect_error) {
       die("Bağlantı hatası: " . $conn->connect_error);
   }

   $sql = "SELECT bolge_name FROM bolge ";
   // Distinct ile tekil markaları alabilirsiniz
   $result = $conn->query($sql);

   // Sonuçları kontrol et ve option etiketlerini oluştur
   if ($result->num_rows > 0) {
       while ($row = $result->fetch_assoc()) {
           echo "<option value='" . $row['bolge_name'] . "'>" . $row['bolge_name'] . "</option>";
       }
   } else {
       echo "<option value=''>Veritabanında Bölge bulunamadı</option>";
   }

   // Veritabanı bağlantısını kapat
   $conn->close();
   ?>
</select>



                    </div><br><br>
                    <button type="submit" class="btn btn-success" name="submit">Kaydet</button>
                    <a href="addcar.php" class="btn btn-danger">Geri Dön</a>
                    </form>





                    </div>
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
    </body>
</html>