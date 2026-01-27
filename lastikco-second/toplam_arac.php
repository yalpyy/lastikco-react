<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php'; ?>
   <head>
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* Tablo stilini burada belirleyebilirsiniz */
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
            color: black; /* Tablo başlıklarının rengini siyah yapar */
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
             
               <!-- end topbar -->
               <!-- dashboard inner -->
               <div class="midde_cont">
                  <div class="container-fluid">
                     <div class="row column_title">
                        <div class="col-md-12">
                           <div class="page_title">
                              <h2>Toplam Araç</h2>
                           </div>
                        </div>
                     </div>
                   
                     <!-- graph -->
                     <?php

$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantıyı kontrol et
if ($conn->connect_error) {
    die("Veritabanı bağlantısında hata: " . $conn->connect_error);
}

// Veritabanından araç bilgilerini çekme sorgusu
$sql = "SELECT car_id, car_name, car_model, created_by, created_date, arac_bolgesi, km FROM cars";
$result = $conn->query($sql);

// Verileri tablo şeklinde ekrana bastırma
if ($result->num_rows > 0) {
    echo "<table id='carsTable'><thead><tr><th>Car ID</th><th>Car Name</th><th>Car Model</th><th>Created By</th><th>Created Date</th><th>Arac Bolgesi</th><th>KM</th></tr></thead><tbody>";
    // Veritabanından gelen her satır için
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>".$row["car_id"]."</td><td>".$row["car_name"]."</td><td>".$row["car_model"]."</td><td>".$row["created_by"]."</td><td>".$row["created_date"]."</td><td>".$row["arac_bolgesi"]."</td><td>".$row["km"]."</td></tr>";
        // Her bir bölgede kaç araç olduğunu hesapla ve ekrana bastır
        if (!isset($carCount[$row["arac_bolgesi"]])) {
            $carCount[$row["arac_bolgesi"]] = 1;
        } else {
            $carCount[$row["arac_bolgesi"]] += 1;
        }
    }
    echo "</tbody></table>";
} else {
    echo "Veritabanında kayıtlı araç bulunamadı.";
}

// Veritabanından arac_bolgesi bilgilerini çekme sorgusu
$sql = "SELECT arac_bolgesi, COUNT(*) AS count FROM cars GROUP BY arac_bolgesi";
$result = $conn->query($sql);

// Pasta grafiği için verileri hazırlama
$labels = [];
$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $labels[] = $row["arac_bolgesi"];
        $data[] = $row["count"];
    }
}

// Veritabanı bağlantısını kapat
$conn->close();
?>


<!-- Pasta grafiği için container -->
<div id="pie-chart-container">
    <canvas id="pie-chart"></canvas>
</div>

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
</script>
<!-- Bölgelerdeki araç sayılarını gösteren tablo -->
<table>
    <thead>
        <tr>
            <th>Arac Bolgesi</th>
            <th>Araç Sayısı</th>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach ($carCount as $region => $count) {
            echo "<tr><td>$region</td><td>$count</td></tr>";
        }
        ?>
    </tbody>
</table>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/jquery.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<!-- DataTables JS -->
<script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
<script>
    $(document).ready(function() {
        $('#carsTable').DataTable();
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
