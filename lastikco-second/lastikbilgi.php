<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php'; ?>
<?php require_once('database/db_conn.php'); ?>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- mobile metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" type="text/css" href="style.css">

    <!-- site metas -->
    <title>Lastik.co Anasayfa</title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- site icon -->
   
    <!-- bootstrap css -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
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
    
    <!-- color css -->
    <!-- site css -->
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.1.2/css/buttons.dataTables.min.css">
    <link rel="icon" href="images/fevicon.png" type="image/png" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
   
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
                                    <h2>Yeni Bilgiler Ekle</h2>
                                </div>
                            </div>
                        </div>
                        <!-- Başlangıç -->
                        <div class="row no-gutters">
                            <div class="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch">
                                <div class="contact-wrap w-75 p-md-5 p-4">
                                <?php
if (isset($_POST['delete_marka'])) {
   
    // Veritabanı bağlantısını oluştur
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Hata kontrolü
    if ($conn->connect_error) {
        die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
    }

    $marka = $_POST['marka'];

    // Silme işlemini gerçekleştir
    $delete_sql = "DELETE FROM lastik_info WHERE marka = '$marka'";
    
    if ($conn->query($delete_sql) === TRUE) {
        echo '<div class="alert alert-success">Marka başarıyla silindi.</div>';
    } else {
        echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
}
?>
                                <?php
                            if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_marka_bilgileri'])) {
                              $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
                             if ($conn->connect_error) {
                                die("Bağlantı hatası: " . $conn->connect_error);
                             }
                             $marka = $_POST['marka']; 
                            // INSERT sorgusunu hazırla ve çalıştır
                             $sql = "INSERT INTO lastik_info (marka) VALUES (?)";
                             $stmt = $conn->prepare($sql);
                             $stmt->bind_param("s", $marka);
                             if ($stmt->execute()) {
                               echo '<div class="alert alert-success">Marka başarıyla Eklendi.</div>';
                             } else {
                                 echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
                                 }
                                 $conn->close();
                                    }
                                    ?>

                                    <h3 class="mb-4">Markalar</h3>
                                    <div id="form-message-warning" class="mb-4"></div>
                                    <table  id="markalar" class="table table-hover text-center">
                                    <thead class="table-dark">
                                     <tr>
                                    <th scope="col">Marka</th>
                                    <th scope="col">Sil</th>
                                        </tr>
                                        </thead>
                                <tbody>
                                     <?php
        
                                      $conn = new mysqli($servername, $username, $password, $dbname);

                                         if ($conn->connect_error) {
                                       die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
                                             }
                                      $query = "SELECT DISTINCT marka FROM lastik_info WHERE marka IS NOT NULL";
                                      $result = $conn->query($query);

                                    while ($row = $result->fetch_assoc()) {
                                     ?>
                                        <tr>
                                        <td><?php echo $row["marka"] ?></td>
                
                                      <td>
                                     <form method="post">
                                        <input type="hidden" name="marka" value="<?php echo $row["marka"]; ?>">
                                        <button type="submit" name="delete_marka" class="btn btn-danger">Sil</button>
                                     </form>
                                        </td>
                                        </tr>
                                     <?php
                                     }
                                 $conn->close();
                                  ?>
                            </tbody>
                                </table>

                                </div>
                            </div>
                            <div class="col-lg-4 col-md-5 d-flex align-items-stretch">
                                <div class="info-wrap bg-light w-100 p-md-5 p-4">
                                    <h3>Marka İsmi Gİrin ..</h3>
                                    <div class="dbox w-100 d-flex align-items-start">
                                    <form method="POST" id="contactForm" name="MarkaForm" class="contactForm" enctype="multipart/form-data">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                   
                                                    <input type="text" class="form-control" name="marka" placeholder="Sadece Marka..">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary" name="save_marka_bilgileri">Kaydet</button>
                                                    <a href="lastikbilgi.php" class="btn btn-danger">Yenile</a>
                                                    <div class="submitting"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    </div>
                                </div>
                            </div>
                            
                        </div>
                           <!-- Desen -->             
                           <div class="row no-gutters">
                            <div class="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch">
                                <div class="contact-wrap w-75 p-md-5 p-4">
                                <?php
if (isset($_POST['delete_desen'])) {
   
    // Veritabanı bağlantısını oluştur
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Hata kontrolü
    if ($conn->connect_error) {
        die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
    }

    $desen = $_POST['desen'];

    // Silme işlemini gerçekleştir
    $delete_sql = "DELETE FROM lastik_info WHERE desen = '$desen'";
    
    if ($conn->query($delete_sql) === TRUE) {
        echo '<div class="alert alert-success">desen başarıyla silindi.</div>';
    } else {
        echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
}
?>
                                <?php
                            if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_desen_bilgileri'])) {
                              $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
                             if ($conn->connect_error) {
                                die("Bağlantı hatası: " . $conn->connect_error);
                             }
                             $desen = $_POST['desen']; 
                            // INSERT sorgusunu hazırla ve çalıştır
                             $sql = "INSERT INTO lastik_info (desen) VALUES (?)";
                             $stmt = $conn->prepare($sql);
                             $stmt->bind_param("s", $desen);
                             if ($stmt->execute()) {
                               echo '<div class="alert alert-success">Desen başarıyla Eklendi.</div>';
                             } else {
                                 echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
                                 }
                                 $conn->close();
                                    }
                                    ?>

                                    <h3 class="mb-4">Desenler</h3>
                                    <div id="form-message-warning" class="mb-4"></div>
                                    <table  id="desenler" class="table table-hover text-center">
                                    <thead class="table-dark">
                                     <tr>
                                    <th scope="col">Desenler</th>
                                    <th scope="col">Sil</th>
                                        </tr>
                                        </thead>
                                <tbody>
                                     <?php
        
                                      $conn = new mysqli($servername, $username, $password, $dbname);

                                         if ($conn->connect_error) {
                                       die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
                                             }
                                      $query = "SELECT DISTINCT desen FROM lastik_info WHERE desen IS NOT NULL";
                                      $result = $conn->query($query);

                                    while ($row = $result->fetch_assoc()) {
                                     ?>
                                        <tr>
                                        <td><?php echo $row["desen"] ?></td>
                
                                      <td>
                                     <form method="post">
                                        <input type="hidden" name="desen" value="<?php echo $row["desen"]; ?>">
                                        <button type="submit" name="delete_desen" class="btn btn-danger">Sil</button>
                                     </form>
                                        </td>
                                        </tr>
                                     <?php
                                     }
                                 $conn->close();
                                  ?>
                            </tbody>
                                </table>

                                </div>
                            </div>
                            <div class="col-lg-4 col-md-5 d-flex align-items-stretch">
                                <div class="info-wrap bg-light w-100 p-md-5 p-4">
                                    <h3>Desen  Gİrin ..</h3>
                                    <div class="dbox w-100 d-flex align-items-start">
                                    <form method="POST" id="contactForm" name="desenForm" class="contactForm" enctype="multipart/form-data">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                   
                                                    <input type="text" class="form-control" name="desen" placeholder="Sadece Desen..">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary" name="save_desen_bilgileri">Kaydet</button>
                                                    <a href="lastikbilgi.php" class="btn btn-danger">Yenile</a>
                                                    <div class="submitting"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    </div>
                                </div>
                            </div>
                            <!-- end dashboard inner -->
                        </div>          





































                          <!--Desen Bitiş --> 
                           <!--Olcu Başlangıç -->   
                           <div class="row no-gutters">
                            <div class="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch">
                                <div class="contact-wrap w-75 p-md-5 p-4">
                                <?php
if (isset($_POST['delete_olcu'])) {
   
    // Veritabanı bağlantısını oluştur
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Hata kontrolü
    if ($conn->connect_error) {
        die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
    }

    $olcu = $_POST['olcu'];

    // Silme işlemini gerçekleştir
    $delete_sql = "DELETE FROM lastik_info WHERE olcu = '$olcu'";
    
    if ($conn->query($delete_sql) === TRUE) {
        echo '<div class="alert alert-success">olcu başarıyla silindi.</div>';
    } else {
        echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
}
?>
                                <?php
                            if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_olcu_bilgileri'])) {
                              $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
                             if ($conn->connect_error) {
                                die("Bağlantı hatası: " . $conn->connect_error);
                             }
                             $olcu = $_POST['olcu']; 
                            // INSERT sorgusunu hazırla ve çalıştır
                             $sql = "INSERT INTO lastik_info (olcu) VALUES (?)";
                             $stmt = $conn->prepare($sql);
                             $stmt->bind_param("s", $olcu);
                             if ($stmt->execute()) {
                               echo '<div class="alert alert-success">olcu başarıyla Eklendi.</div>';
                             } else {
                                 echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
                                 }
                                 $conn->close();
                                    }
                                    ?>

                                    <h3 class="mb-4">olculer</h3>
                                    <div id="form-message-warning" class="mb-4"></div>
                                    <table  id="olculer" class="table table-hover text-center">
                                    <thead class="table-dark">
                                     <tr>
                                    <th scope="col">Olculer</th>
                                    <th scope="col">Sil</th>
                                        </tr>
                                        </thead>
                                <tbody>
                                     <?php
        
                                      $conn = new mysqli($servername, $username, $password, $dbname);

                                         if ($conn->connect_error) {
                                       die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
                                             }
                                      $query = "SELECT DISTINCT olcu FROM lastik_info WHERE olcu IS NOT NULL"; 
                                      $result = $conn->query($query);

                                    while ($row = $result->fetch_assoc()) {
                                     ?>
                                        <tr>
                                        <td><?php echo $row["olcu"] ?></td>
                
                                      <td>
                                     <form method="post">
                                        <input type="hidden" name="olcu" value="<?php echo $row["olcu"]; ?>">
                                        <button type="submit" name="delete_olcu" class="btn btn-danger">Sil</button>
                                     </form>
                                        </td>
                                        </tr>
                                     <?php
                                     }
                                 $conn->close();
                                  ?>
                            </tbody>
                                </table>

                                </div>
                            </div>
                            <div class="col-lg-4 col-md-5 d-flex align-items-stretch">
                                <div class="info-wrap bg-light w-100 p-md-5 p-4">
                                    <h3>Ölçü Gİrin ..</h3>
                                    <div class="dbox w-100 d-flex align-items-start">
                                    <form method="POST" id="contactForm" name="olcuForm" class="contactForm" enctype="multipart/form-data">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                   
                                                    <input type="text" class="form-control" name="olcu" placeholder="Sadece Ölcü..">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary" name="save_olcu_bilgileri">Kaydet</button>
                                                    <a href="lastikbilgi.php" class="btn btn-danger">Yenile</a>
                                                    <div class="submitting"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    </div>
                                </div>
                            </div>
                            <!-- end dashboard inner -->
                        </div>          
  
                           <!--Olcu Bitiş -->  
                          

                    </div>
                </div>
            </div>
        </div>
    </div>
   
      
      <script src="js/jquery.min.js"></script>
      <script src="js/popper.min.js"></script>
      <script src="js/bootstrap.min.js"></script>
      <!-- wow animation -->
      <script src="js/animate.js"></script>
      <!-- select country -->
      <script src="js/bootstrap-select.js"></script> 
      <!-- nice scrollbar -->
      <script src="js/perfect-scrollbar.min.js"></script>
      <script>
         var ps = new PerfectScrollbar('#sidebar');
      </script>

<script>
    $(document).ready(function () {
        // Tabloyu düğmelerle birlikte başlat
        var table = $('#markalar').DataTable({
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf'],
            pageLength: 5 // Sayfa başına görüntülenen satır sayısını ayarla
        });
    });
</script>

<script>
    $(document).ready(function () {
        // Tabloyu düğmelerle birlikte başlat
        var table = $('#desenler').DataTable({
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf'],
            pageLength: 5 // Sayfa başına görüntülenen satır sayısını ayarla
        });
    });
</script>

<script>
    $(document).ready(function () {
        // Tabloyu düğmelerle birlikte başlat
        var table = $('#olculer').DataTable({
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf'],
            pageLength: 5 // Sayfa başına görüntülenen satır sayısını ayarla
        });
    });
</script>
 <!-- Kullanılan js -->
 <script src="js/chart_custom_style1.js"></script>
      <script src="js/custom.js"></script>
 
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
