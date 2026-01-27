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
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.1.2/css/buttons.dataTables.min.css">
    <link rel="icon" href="images/fevicon.png" type="image/png" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
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
   
</head>
<body class="dashboard dashboard_1">
    <div class="full_container">
        <div class="inner_container">
            <!-- Sidebar  -->
            <!-- end sidebar -->
            <!-- right content -->
            <div id="content">
                <!-- topbar -->
             
                <!-- dashboard inner -->
                <div class="midde_cont">
                    <div class="container-fluid">
                        <div class="row column_title">
                            <div class="col-md-12">
                                <div class="page_title">
                                    <h2>Yeni Bölge Ekle</h2>
                                </div>
                            </div>
                        </div>
                        <!-- Başlangıç -->
                        <div class="row no-gutters">
                            <div class="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch">
                                <div class="contact-wrap w-100 p-md-5 p-4">
                                <?php
if (isset($_POST['delete_bolge'])) {
    // Veritabanı bağlantısını oluştur
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Hata kontrolü
    if ($conn->connect_error) {
        die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
    }

    $delete_bolge_id = $_POST['delete_bolge_id'];
    
    // Silme işlemini gerçekleştir
    $delete_sql = "DELETE FROM bolge WHERE bolge_id = $delete_bolge_id";

    if ($conn->query($delete_sql) === TRUE) {
        echo '<div class="alert alert-success">Bolge başarıyla silindi.</div>';
    } else {
        echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
} ?>
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_bolge_bilgileri'])) {
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }
    $bolge_name = $_POST['bolge_name']; // Formdan bölge adını alın
    $created_by = $usernames;
    // INSERT sorgusunu hazırla ve çalıştır
    $sql = "INSERT INTO bolge (bolge_name, created_by, created_date) VALUES (?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $bolge_name, $created_by);
    if ($stmt->execute()) {
        echo '<div class="alert alert-success">Bolge başarıyla Eklendi.</div>';
    } else {
        echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
    }
    $conn->close();
}
?>
                                    <h3 class="mb-4">Bölgeler</h3>
                                    <div id="form-message-warning" class="mb-4"></div>
                                    <table  id="bolgeler" class="table table-hover text-center">
    <thead class="table-dark">
        <tr>
            <th scope="col">Bölge no</th>
            <th scope="col">Bolge Adı</th>
            <th scope="col">Oluşturan</th>
            <th scope="col">Oluşturma Tarihi</th>
            <th scope="col">Sil</th>
        </tr>
    </thead>
    <tbody>
        <?php
        // Veritabanı bağlantısı
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Hata kontrolü
        if ($conn->connect_error) {
            die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
        }

        // Veritabanı sorgusu
        $query = "SELECT * FROM bolge";
        $result = $conn->query($query);

        // Sonuçları göster
        while ($row = $result->fetch_assoc()) {
        ?>
            <tr>
                <td><?php echo $row["bolge_id"] ?></td>
                <td><?php echo $row["bolge_name"] ?></td>
                <td><?php echo $row["created_by"] ?></td>
                <td><?php echo $row["created_date"] ?></td>
                <td>
                    <form method="post">
                        <input type="hidden" name="delete_bolge_id" value="<?php echo $row["bolge_id"]; ?>">
                        <button type="submit" name="delete_bolge" class="btn btn-danger">Sil</button>
                    </form>
                </td>
            </tr>
        <?php
        }

        // Veritabanı bağlantısını kapat
        $conn->close();
        ?>
    </tbody>
</table>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-5 d-flex align-items-stretch">
                                <div class="info-wrap bg-light w-100 p-md-5 p-4">
                                    <h3>Bölge İsmi Gİrin ..</h3>
                                    <div class="dbox w-100 d-flex align-items-start">
                                    <form method="POST" id="contactForm" name="akuForm" class="contactForm" enctype="multipart/form-data">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                   
                                                    <input type="text" class="form-control" name="bolge_name" placeholder="Sadece İlçe..">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary" name="save_bolge_bilgileri">Kaydet</button>
                                                    <a href="newregion.php" class="btn btn-danger">Yenile</a>
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


 <!-- Kullanılan js -->
 
      <!-- custom js -->
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

<script>
    $(document).ready(function () {
        // Tabloyu düğmelerle birlikte başlat
        var table = $('#bolgeler').DataTable({
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf'],
            pageLength: 10 // Sayfa başına görüntülenen satır sayısını ayarla
        });
    });
</script>


</body>
</html>
