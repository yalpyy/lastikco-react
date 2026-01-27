<!DOCTYPE html>
<html lang="en"><?php include 'menu/navbar.php'; ?>
<?php

require_once('database/db_conn.php');


?>
<?php
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı kontrolü
if ($conn->connect_error) {
    die("Veritabanına bağlanılamadı: " . $conn->connect_error);
}

$created_by = $usernames;
if(isset($_POST['submit'])) {
    // Formdan gelen verileri al
    $marka = $_POST['marka'];
    $watt = $_POST['watt'];
    $amper = $_POST['amper'];
    $durum = $_POST['durum'];
    

    // SQL sorgusu oluştur
    $sql = "INSERT INTO akü (car_id, durum, marka, watt, amper, created_by, created_date) VALUES (NULL, '$durum', '$marka', $watt, $amper, '$usernames', NOW())";

    // Sorguyu çalıştır ve sonucu kontrol et
    if ($conn->query($sql) === TRUE) {
        echo "Veri başarıyla eklendi";
    } else {
        echo "Hata: " . $sql . "<br>" . $conn->error;
    }
}

// Veritabanı bağlantısını kapat
$conn->close();
?>

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
                              <h2>Akü Ekleme</h2>
                           </div>
                        </div>
                     </div>
                    
                    </div>
                    <!-- dashboard inner -->
                    <div class="midde_cont" style="margin-top: 100px;">
                    <form action="" method="post" class="addcarForm">
    <div class="row">
        <div class="col-6 col-md-4"> <label class="input-group-text" for="marka">Marka :</label></div>
        <div class="col-6 col-md-4"> <label class="input-group-text" for="watt">Watt :</label></div>
        <div class="col-6 col-md-4"> <label class="input-group-text" for="amper">Amper :</label></div>
    </div>
    <div class="row">
        <div class="col">
            <input type="text" id="marka" name="marka" class="form-control" required><br><br>
        </div>
        <div class="col">
            <input type="text" id="watt" name="watt" class="form-control" required>
        </div>
        <div class="col">
            <input type="text" id="amper" name="amper" class="form-control" required>
        </div>
    </div>
    <div class="row">
        <div class="col-6 col-md-4">
            <label class="input-group-text" for="durum">Durum :</label>
        </div>
        <div class="col">
            <select id="durum" name="durum" class="form-control" required>
                <option value="uygun">Uygun</option>
                <option value="kullanilmis">Kullanılmış</option>
                <option value="arizali">Arızalı</option>
            </select>
        </div>
    </div>
    <button type="submit" class="btn btn-success" name="submit">Save</button>
    <a href="addcar.php" class="btn btn-danger">Cancel</a>
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