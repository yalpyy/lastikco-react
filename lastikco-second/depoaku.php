<!DOCTYPE html>
<html lang="en"><?php include 'menu/navbar.php'; ?>
<?php
require_once('database/db_conn.php');

   
?>

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
<!-- Add this inside the head section or in your existing style block -->
<style>
    .resized-image {
        max-width: 50%;  /* Set the maximum width to 100% of its parent container */
        max-height: 100px;  /* Set the maximum height to your desired value */
        display: block;  /* Ensures the image is displayed as a block element */
        margin: 0 auto;  /* Center the image horizontally */
    
    }
</style>
<style>
.addcarForm table {
    width: 100%;
    height: 200px; /* İstenilen yükseklik değeri */
}
.addcarForm td {
    padding: 5px; /* Hücreler arasındaki boşluğu ayarla */
    top:5px;
}
.addcarForm tr {
    padding: 5px; /* Hücreler arasındaki boşluğu ayarla */
     top:5px;
}
</style>

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
    
      <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">



    
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
                              <h2>Depoya Sıfır Akü Ekle </h2>
                           </div>
                        </div>
                     </div>
                     <!-- Baslangıc -->
                     <div class="row no-gutters">
							<div class="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch">
								<div class="contact-wrap w-100 p-md-5 p-4">
									<h3 class="mb-4">Akü  Bilgileri </h3>
									<div id="form-message-warning" class="mb-4"></div> 
			
									<form action="" method="post" class="addcarForm">
    <table >
        <tr>
            <td><label class="input-group-text" for="marka">Marka :</label></td>
            <td><label class="input-group-text" for="watt">Volt :</label></td>
            <td><label class="input-group-text" for="amper">Amper :</label></td>
            <td><label class="input-group-text" for="durum">Durum :</label></td>
            <td><label class="input-group-text" for="faturatarihi">Fatura Tarihi :</label></td>
        </tr>
        <tr>
            <td>
                <select id="marka" name="marka" class="form-control" required>
                    <option value="Varta">Varta</option>
                    <option value="İnci">İnci</option>
                    <option value="Mutlu">Mutlu</option>
                    <option value="Yiğit">Yiğit</option>
                    <option value="Bosh">Bosh</option>
                    <option value="President">President</option>
                    <option value="Orbus">Orbus</option>
                    <option value="Hugel">Hugel</option>
                </select>
            </td>
            <td>
                <select id="watt" name="watt" class="form-control" required>
                    <option value="12V">12V</option>
                    <option value="24V">24V</option>
                </select>
            </td>
            <td>
                <select id="amper" name="amper" class="form-control" required>
                    <option value="7Ah">7Ah</option>
                    <option value="24Ah">24Ah</option>
                    <option value="60Ah">60Ah</option>
                    <option value="72Ah">72Ah</option>
                    <option value="74Ah">74Ah</option>
                </select>
            </td>
            <td>
                <select id="durum" name="durum" class="form-control" required>
                    <option value="İyi">İyi</option>
                    <option value="Şarjda">Şarjda</option>
                    <option value="Hurda">Hurda</option>
                </select>
            </td>
            <td>
             
                    <input type="text" class="form-control" id="faturatarihi" name="faturatarihi" placeholder="Fatura Tarihi">
              
            </td>
        </tr>
    </table>

    <button type="submit" class="btn btn-success" name="submit">Kaydet</button>
    <a href="addcar.php" class="btn btn-danger">İptal</a>
</form>

									</form>
								</div>
							</div>
							<div class="col-lg-4 col-md-5 d-flex align-items-stretch" >
								<div class="info-wrap bg-light w-100 p-md-5 p-4">
								
							
				        	<div class="dbox w-100 d-flex align-items-start">
                           
                          
                          <img src="images\layout_img\akures1.png" style="width:250px;" alt="Akü FOTOĞRAFI">
</div>
                           
				          </div>
			          </div>

		                    </div>
               <!-- end dashboard inner -->
                    </div>
                    
                 </div>

        
                 <div> <!-- AraçtakiLastikler -->
                 <div class="midde_cont" style="margin-top: 50px;">
                 <?php
if (isset($_POST['delete_akü'])) {
    // Veritabanı bağlantısını oluştur
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Hata kontrolü
    if ($conn->connect_error) {
        die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
    }

    $delete_akü_id = $_POST['delete_akü_id'];
    
    // Silme işlemini gerçekleştir
    $delete_sql = "DELETE FROM aku WHERE aku_id = $delete_akü_id";

    if ($conn->query($delete_sql) === TRUE) {
        echo '<div class="alert alert-success">Akü başarıyla silindi.</div>';
    } else {
        echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
}
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
    $faturatarihi = $_POST['faturatarihi'];
    
    // SQL sorgusu oluştur
    $sql = "INSERT INTO aku (car_id, marka,durum,  watt, amper,faturatarihi, created_by) VALUES (NULL, '$durum', '$marka', '$watt', '$amper','$faturatarihi', '$usernames')";

    // Sorguyu çalıştır ve sonucu kontrol et
    if ($conn->query($sql) === TRUE) {
        echo '<div class="alert alert-success">Akü başarıyla Eklendi.</div>';
    } else {
        echo '<div class="alert alert-danger">Hata oluştu: ' . $conn->error . '</div>';
    }
}

// Veritabanı bağlantısını kapat

?>                
                



                    <!-- Continue with the rest of your dashboard content -->
                    <div class="mb-3">
                    <table  id="akuler" class="table table-hover text-center">
    <thead class="table-dark">
        <tr>
            <th scope="col">Aku no</th>
            <th scope="col">Akü Marka</th>
            <th scope="col">Akü Watt</th>
            <th scope="col">Akü Amper</th>
            <th scope="col">Akü Durum</th>
            <th scope="col">Fatura Tarihi</th>
            <th scope="col">Oluşturan</th>
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
        $query = "SELECT * FROM aku WHERE car_id IS NULL";
        $result = $conn->query($query);

        // Sonuçları göster
        while ($row = $result->fetch_assoc()) {
        ?>
            <tr>
                <td><?php echo $row["aku_id"] ?></td>
                <td><?php echo $row["marka"] ?></td>
                <td><?php echo $row["watt"] ?></td>
                <td><?php echo $row["amper"] ?></td>
                <td><?php echo $row["durum"] ?></td>
                <td><?php echo $row["faturatarihi"] ?></td>
                <td><?php echo $row["created_by"] ?></td>
                <td>
                    <form method="post">
                        <input type="hidden" name="delete_akü_id" value="<?php echo $row["aku_id"]; ?>">
                        <button type="submit" name="delete_akü" class="btn btn-danger">Sil</button>
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
                    </div><!-- Arac içindeki Lastik tablosu -->
    </div>  <!-- Div Middle -->
      <!-- jQuery -->
      
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
        var table = $('#akuler').DataTable({
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf'],
            pageLength: 10 // Sayfa başına görüntülenen satır sayısını ayarla
        });
    });
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
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/i18n/jquery-ui-i18n.min.js"></script>
<script>
    $(document).ready(function(){
        $("#faturatarihi").datepicker({
            dateFormat: "dd.mm.yy", // Türkçe tarih formatı
            monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
            dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
            dayNamesShort: ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
            dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
            firstDay: 1, // Haftanın ilk günü (0: Pazar, 1: Pazartesi)
            isRTL: false, // Metin yazım yönü (false: soldan sağa)
            showMonthAfterYear: true, // Yılın sonuna göre ay gösterimi
            yearSuffix: "" // Yıl sonuna ek olarak yazılacak metin (örneğin, 'yıl')
        });
    });
</script>


   </body>
</html>