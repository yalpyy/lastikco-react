<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php';
require_once('database/db_conn.php');
$car_id = $_GET['car_id']; ?>

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
     

      
      <!-- custom css -->
      <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
      <![endif]-->

     
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css">
    


   </head>
   <body class="dashboard dashboard_1">
      <div class="full_container">
         <div class="inner_container">
              <!-- Sidebar  -->
              
            <!-- end sidebar -->
            <!-- right content -->
            <div id="content">
               <!-- topbar -->
              
               <!-- end topbar -->

               <!-- dashboard inner -->
               <div class="midde_cont">
                  <div class="container-fluid">

                  <?php
$conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}
$car_id = $_GET['car_id'];

// Veritabanından car_name ve arac_bolgesi bilgilerini almak için sorgu yapılıyor
$sql = "SELECT car_name, arac_bolgesi FROM cars WHERE car_id = $car_id";
$result = $conn->query($sql);

// Sonucu kontrol ediyoruz ve car_name ve arac_bolgesi değerlerini alıyoruz
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $car_name = $row["car_name"];
        $arac_bolgesi = $row["arac_bolgesi"];
    }
} else {
    $car_name = "Bulunamadı";
    $arac_bolgesi = "Bulunamadı";
}

// Bağlantıyı kapat
$conn->close();
// Bağlantıyı kapat

?>
                     <div class="row column_title">
                        <div class="col-md-12">
                           <div class="page_title">
                              <h2>Araç Plaka : <?php  echo $car_name   ?> Araç Bölgesi : <?php echo utf8_encode($arac_bolgesi); ?>   </h2>
                           </div>
                        </div>
                     </div>
                     <!-- Baslangıc -->
                     <div class="row no-gutters">
							<div class="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch">
								<div class="contact-wrap w-100 p-md-5 p-4">
									<h3 class="mb-4">Lastik Bilgileri </h3>
									<div id="form-message-warning" class="mb-4"></div> 
			
									<form method="POST" id="contactForm" name="tireForm" class="contactForm" enctype="multipart/form-data" >
										<div class="row">
											<div class="col-md-3">
												<div class="form-group">
													<label class="label" for="serino">Seri No</label>
                                                    <input type="text" class="form-control" name="tier_serino" placeholder="Seri No">
												</div>
											</div>
											<div class="col-md-3"> 
												<div class="form-group">
													<label class="label" for="marka">Marka</label>
                                                    <select class="form-control" name="tier_marka"  placeholder="Marka Seçiniz.." required>
    <?php
    // Veritabanından marka bilgilerini al
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    $sql = "SELECT  marka FROM lastik_info WHERE marka IS NOT NULL"; // Distinct ile tekil markaları alabilirsiniz
    $result = $conn->query($sql);

    // Sonuçları kontrol et ve option etiketlerini oluştur
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<option value='" . $row['marka'] . "'>" . $row['marka'] . "</option>";
        }
    } else {
        echo "<option value=''>Veritabanında marka bulunamadı</option>";
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
    ?>
</select>
												</div>
											</div>
											<div class="col-md-3">
												<div class="form-group">
													<label class="label" for="desen">Desen</label>
                                                    <select class="form-control" name="tier_desen"  placeholder="desen Seçiniz.." required>
    <?php
    // Veritabanından marka bilgilerini al
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    $sql = "SELECT  desen FROM lastik_info WHERE desen IS NOT NULL"; // Distinct ile tekil markaları alabilirsiniz
    $result = $conn->query($sql);

    // Sonuçları kontrol et ve option etiketlerini oluştur
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<option value='" . $row['desen'] . "'>" . $row['desen'] . "</option>";
        }
    } else {
        echo "<option value=''>Veritabanında desen bulunamadı</option>";
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
    ?>
</select>
												</div>
											</div>
											<div class="col-md-3">
												<div class="form-group">
													<label class="label" for="#">Ölçü</label>
                                                   
                                                    <select class="form-control" name="tier_olcu"  placeholder="Ölçü Seçiniz.." required>
    <?php
    // Veritabanından marka bilgilerini al
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);
    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    $sql = "SELECT olcu FROM lastik_info WHERE olcu IS NOT NULL";
    // Distinct ile tekil markaları alabilirsiniz
    $result = $conn->query($sql);

    // Sonuçları kontrol et ve option etiketlerini oluştur
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<option value='" . $row['olcu'] . "'>" . $row['olcu'] . "</option>";
        }
    } else {
        echo "<option value=''>Veritabanında olcu bulunamadı</option>";
    }

    // Veritabanı bağlantısını kapat
    $conn->close();
    ?>
</select>
													
												</div>
											</div>
                                           
                                            <div class="col-md-3">
												<div class="form-group">
													<label class="label" for="#">Lastik Durum</label>
                                                    <select class="form-control" name="tier_durum" required>
                                                    <option value="Kullanılabilir">Kullanılabilir</option>
                                                    <option value="Arızalı">Arızalı</option>
                                                    <option value="Onarım Bekliyor">Onarım Bekliyor</option>
                                                    </select>
												</div>
											</div>
                                            <div class="col-md-3">
    <div class="form-group">
        <label class="label" for="#">Ölçüm Tarihi</label>
        <input type="text" class="form-control" id="tier_olcumtarihi" name="tier_olcumtarihi" placeholder="Ölçüm Tarihi">
    </div>
</div>
                                            <div class="col-md-3">
												<div class="form-group">
													<label class="label" for="#">Ölçüm Km</label>
                                                    <input type="text" class="form-control" name="tier_olcumkm" placeholder="Ölçüm KM">
												</div>
											</div>
                                            <div class="col-md-3">
												<div class="form-group">
													<label class="label" for="#">Lastik Pozisyon</label>
                                                    <input type="text" class="form-control" id="position_display" name="tier_position" readonly required>
												</div>
											</div>
                                            <div class="col-md-3">
												<div class="form-group">
													<label class="label" for="#">Firma </label>
                                                    <input type="text" class="form-control" name="firma" placeholder="Firma">
												</div>
											</div>
                                            <div class="col-md-6">
												<div class="form-group">
                                               
                                                <a href="addcar.php" class="btn btn-danger">Geri Dön</a>
                                                <button type="button" class="btn btn-success" id="update_tire_details">Güncelle</button>
                                                
                                                <div class="col-md-6">
 
                                                
													<div class="submitting"></div>
												</div>
											</div>
                                            <!-- Add this inside the form -->
                                            <div class="col-md-6">
                                              <div class="form-group">
                                             <label class="label" for="#">Lastik Resmi</label>
                                             <input type="file" class="form-control-file" name="tier_resim_path" >
                                             </div>
                                            </div>
                                                <!-- Add this inside the form or wherever you want to display the image -->
                                                <div class="form-group">
    
                                               
                                                <img id="preview-image" alt="Image" style="max-width: 100%; height: 100%; margin-top: -100px; margin-right: 30px; cursor: pointer;" onclick="openImageInNewTab()">




</div>
</div>

                                
											
										</div>
									</form>
								</div>
							</div>
							<div class="col-lg-4 col-md-5 d-flex align-items-stretch" >
								<div class="info-wrap bg-light w-100 p-md-5 p-4">
									<h3> Lastik Seçiniz</h3> 
							
				        	<div class="dbox w-100 d-flex align-items-start">
                            <link rel="stylesheet"  href="css/AksTables.css" /> 
                            <table class="table1" id="tables">        
                <tbody >
                    <tr>
                        <td>Sağ Ön<input type="radio" id="1akssag" name="aks1" style="height:35px; width:35px; vertical-align: middle;" value="1.AksSağÖn" onchange="updatePosition(this)" required></td>
                        <td></td>
                        <td>Sağ Dış<input type="radio" id="2akssagdıs" name="aks2" style="height:35px; width:35px; vertical-align: middle;" value="2.AksSağDış" onchange="updatePosition(this)" required></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Sağ İç<input type="radio" id="2akssagıc" name="aks3" style="height:35px; width:35px; vertical-align: middle;" value="2.AksSağİç" onchange="updatePosition(this)" required></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Sol İç <input type="radio" id="2akssolıc" name="aks4" style="height:35px; width:35px; vertical-align: middle;" value="2.AksSolİç" onchange="updatePosition(this)" required></td>
                    </tr>
                    <tr>
                        <td>Sol Ön<input type="radio" id="1akssolon" name="aks5" style="height:35px; width:35px; vertical-align: middle;"value="1.AksSolÖn" onchange="updatePosition(this)" required></td>
                        <td></td>
                        <td>Sol Dış <input type="radio" id="2akssoldıs" name="aks6" style="height:35px; width:35px; vertical-align: middle;" value="2.AksSolDış" onchange="updatePosition(this)" required></td>
                    </tr>
                </tbody>
            </table>
            
            
                           
				          </div>
			          </div>

		                    </div>
               <!-- end dashboard inner -->
                    </div>
                    
                 </div>
                 
 
                 <div> <!-- AraçtakiLastikler -->
                 <div class="midde_cont" style="margin-top: 50px;">
                 <div  style="margin-bottom:20px;" class="col-md-3"id="lastik_bildirim"></div>
                 <button  style="margin-bottom:20px;" class="btn cur-p btn-primary" id="depodan_lastik_getir" onclick="openPopup('depodan_lastik_getir.php?car_id=<?php echo $car_id ?> ',900,600)">Depodan Lastik Getir</button>
                 
                 <button style="margin-bottom:20px;" class="btn cur-p btn-primary" onclick="openPopup('aracbolge.php?car_id=<?php echo $car_id ?>',500,200)">Araç Bölge Değiştir</button>
                  
                 <button style="margin-bottom:20px;" class="btn cur-p btn-primary" onclick="openPopup('lastik_cıkart.php?car_id=<?php echo $car_id ?>',1200,700)">Araçtan Lastik Çıkart</button>
                 
                 <button style="margin-bottom:20px;" class="btn cur-p btn-primary" onclick="openPopup('arac_gecmisi.php?car_id=<?php echo $car_id ?>',1200,700)">Araç Geçmişi</button>
                    <!-- Continue with the rest of your dashboard content -->
                   
                    <div class="mb-6">
                 
        </div>
        
<?php

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_tier_barkodno1'])) {
    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

    if ($conn->connect_error) {
        die("Bağlantı hatası: " . $conn->connect_error);
    }

    // Formdan gelen verileri alın
   
    $created_by = $usernames; // Bu değeri kullanıcı adına göre güncelleyin

    if (isset($_FILES['tier_resim_path']) && $_FILES['tier_resim_path']['size'] > 0) {
        $img = $_FILES['tier_resim_path']['tmp_name']; // Geçici dosya yolu
    
        // Resmi base64 koduna dönüştür
        $imgData = base64_encode(file_get_contents($img));
    } else {
        $imgData = NULL; // Resim dosyası yoksa, $imgData'yı NULL olarak ayarla
    }
    

    // Formdan gelen POST verilerini değişkenlere atayın
    $seriNo = $_POST['tier_serino'];
    $marka = $_POST['tier_marka'];
    $desen = $_POST['tier_desen'];
    $olcu = $_POST['tier_olcu'];
    
    $durum = $_POST['tier_durum'];
    $olcumTarihi = $_POST['tier_olcumtarihi'];
    $olcumKM = $_POST['tier_olcumkm'];
    $firma = $_POST['firma'];
    $position = $_POST['tier_position'];

    // Resim dosyası var mı kontrol et
   

    // Tires tablosuna veri ekleyin
    if ($car_id !== '') {
        $tiresSql = "INSERT INTO tires (car_id, created_by, created_date) VALUES ('$car_id', '$usernames', NOW())";
        
        if ($conn->query($tiresSql) === TRUE) {
            $tire_id = $conn->insert_id;

            $tireDetailsSql = "INSERT INTO tire_details (tire_id, tire_position, tire_serino, tire_marka, tire_desen, tire_olcu, tire_durum, tire_olcumtarihi, tire_olcumkm,firma, tire_resim_path, created_by, created_date) 
                                VALUES ('$tire_id', '$position', '$seriNo', '$marka', '$desen', '$olcu', '$durum', '$olcumTarihi', '$olcumKM', '$firma', ?, '$created_by', NOW())";

            // Prepare statement
            $stmt = $conn->prepare($tireDetailsSql);
            // Bind parameters
            $stmt->bind_param("s", $imgData);
            
            if ($stmt->execute()) {
                echo '<div class="alert alert-success">Lastik başarıyla Eklendi.</div>';
            } else {
                echo "Error: " . $tireDetailsSql . "<br>" . $conn->error;
            }
        } else {
            echo "Error: " . $tiresSql . "<br>" . $conn->error;
        }
    } else {
        echo '<div class="alert alert-success">Car_id Boş Olamaz.</div>';
    }

    $conn->close();
}
?>
        
                    <?php
                    // Veritabanı bağlantı bilgileri
                    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

                    if ($conn->connect_error) {
                        die("Bağlantı hatası: " . $conn->connect_error);
                    }

                    // SQL sorgusu
                    $sql = "SELECT td.tire_id, td.tire_position, td.tire_serino, td.tire_marka, td.tire_desen, td.tire_olcu, td.tire_disderinligi, td.tire_durum, td.tire_olcumtarihi, td.tire_olcumkm,td.firma, td.tire_resim_path, td.created_by, td.created_date
                            FROM tires t
                            JOIN tire_details td ON t.tire_id = td.tire_id
                            WHERE t.car_id = '$car_id'";

                    // Sorguyu çalıştır
                    $result = $conn->query($sql);

                    // Sorgu sonuçlarını kontrol et ve tabloyu yazdfır
                    if ($result !== false && $result->num_rows > 0) {
                    ?>
                         <table id="lastiks" class="table table-hover text-center">
                            <thead class="table-dark">
                                <tr>
                                    <th>Position</th>
                                    <th>Seri No</th>
                                    <th>Marka</th>
                                    <th>Desen</th>
                                    <th>Ölçü</th>
                                    <th>Diş Derinliği</th>
                                    <th>Durum</th>
                                    <th>Ölçüm Tarihi</th>
                                    <th>Ölçüm KM</th>
                                    <th>Firma</th>
                                  <!--  <th>Resim</th> -->
                                    <th>Oluşturan</th>
                                    <th>Oluşturma Tarihi</th>
                                    <th>Düzenle</th>
                                    <th>Diş Derinliği</th>
                                    <th>KM</th>
                                    <th>Basınç</th>
                                    <th>Geçmiş</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                while ($row = $result->fetch_assoc()) {
                                ?>
                                    <tr>
                                        <td><?= $row['tire_position'] ?></td>
                                        <td><?= $row['tire_serino'] ?></td>
                                        <td><?= $row['tire_marka'] ?></td>
                                        <td><?= $row['tire_desen'] ?></td>
                                        <td><?= $row['tire_olcu'] ?></td>
                                        <td><?= $row['tire_disderinligi'] ?></td>
                                        <td><?= $row['tire_durum'] ?></td>
                                        <td><?= $row['tire_olcumtarihi'] ?></td>
                                        <td><?= $row['tire_olcumkm'] ?></td>
                                        <td><?= $row['firma'] ?></td>
                                       <!-- <td><?= $row['tire_resim_path'] ?></td> -->
                                        <td><?= $row['created_by'] ?></td>
                                        <td><?= $row['created_date'] ?></td>
                                        <td><button class="edit-btn btn cur-p btn-light" data-tire-id="<?= $row['tire_id'] ?>">Düzenle</button></td>
                                        <input type="hidden" name="hidden_tire_id" id="hidden_tire_id" value="">
                                        <!-- tablodaki -->
                                        <td><button class="edit-disderinligi btn cur-p btn-outline-warning" onclick="openDisDerinligiPage('<?php echo $car_id ?>', '<?php echo $row['tire_id'] ?>')">Diş Derinliği</button></td>
                                        <td><button class="edit-km btn cur-p btn-outline-warning" onclick="openKMBilgiPage('<?php echo $car_id ?>', '<?php echo $row['tire_id'] ?>')">KM</button></td>
                                        <td><button class="edit-disderinligi btn cur-p btn-outline-warning" onclick="openBasıncBilgiPage('<?php echo $car_id ?>', '<?php echo $row['tire_id'] ?>')">Basınç</button></td>
                                        <td><button class="edit-disderinligi btn cur-p btn-outline-warning" onclick="openGecmisPage('<?php echo $car_id ?>', '<?php echo $row['tire_id'] ?>')">Geçniş</button></td>
                                       
                                    </tr>
                                    <?php
                                }
                                ?>
                            </tbody>
                        
                        </table>
                       
                        
                    <?php
                    } else {
                        echo "0 results";
                    }

                    // Sorgu sonuçlarını kapat
                    $result->close();

                    // Veritabanı bağlantısını kapat
                    $conn->close();
                    ?>
                </div>
                    
						
                                
                               
                    </div><!-- Arac içindeki Lastik tablosu -->



    </div>  <!-- Div Middle -->
      <!-- jQuery -->
      
      <script>
        function updatePosition(radio) {
            // Radio düğmesi seçildiğinde, input alanına değeri yaz
            document.getElementById("position_display").value = radio.value;
        }
    </script>
      <script src="js/jquery.min.js"></script>
      <script>
    $(document).ready(function () {
        // Tabloyu düğmelerle birlikte başlat
        var table = $('#lastiks').DataTable({
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf'],
            pageLength: 10 // Sayfa başına görüntülenen satır sayısını ayarla
        });
    });</script>
    <script>
      $(document).ready(function() {
    // Sayfa yüklendiğinde tablodaki satır sayısını kontrol et ve buton durumunu ayarla
    checkTableRowCount();
});

// Tablodaki satır sayısını kontrol eden fonksiyon
function checkTableRowCount() {
    var rowCount = $('#lastiks tbody tr').length;
    // Satır sayısını kontrol et
    if (rowCount >= 6) {
        // Tablodaki satır sayısı 6'dan büyükse bildirim mesajını ekrana yaz
        $('#depodan_lastik_getir').prop('disabled', true);
        $('#lastik_bildirim').html('<div class="alert alert-success">Yeterince Lastik  Eklendi.</div>');
    } else {
        // Tablodaki satır sayısı 6'dan küçükse butonun tıklama işlevini etkinleştir
        $('#depodan_lastik_getir').prop('disabled', false);
        $('#lastik_bildirim').html(''); // Bildirim alanını temizle
    }
}

    </script>
   <script>
    $(document).ready(function() {
    $('#depodan_lastik_getir').on('click', function() {
        // Ajax isteği göndererek veritabanından lastikleri getirme işlemini gerçekleştir
        $.ajax({
            url: 'depodan_lastik_getir.php', // Lastikleri getirecek PHP dosyasının yolu
            type: 'GET', // Veri almak için GET isteği kullanıyoruz
            success: function(response) {
                // Lastikleri getirdikten sonra başarılı bir şekilde geri dönen yanıtı işle
                // Örneğin, tabloyu güncelleyebilirsiniz
                // Burada tabloyu güncellemek için bir işlev çağırabilirsiniz veya doğrudan tablonun içeriğini güncelleyebilirsiniz
                // Örnek olarak:
                // $('#lastikler_tablosu').html(response); // Bu response, sunucudan dönen HTML içeriğini içerir
                console.log('Lastikler başarıyla getirildi:', response);
            },
            error: function(xhr, status, error) {
                // İsteğin başarısız olduğu durumda hata mesajını işle
                console.error('Lastikleri getirirken bir hata oluştu:', error);
            }
        });
    });
});
</script> 


<script>
$(document).ready(function() {
    $('#dis_derinligi').on('click', function() {
        // Ajax isteği göndererek veritabanından lastikleri getirme işlemini gerçekleştir
        $.ajax({
            url: 'dis_derinligi.php', // Lastikleri getirecek PHP dosyasının yolu
            type: 'GET', // Veri almak için GET isteği kullanıyoruz
            success: function(response) {
                // Lastikleri getirdikten sonra başarılı bir şekilde geri dönen yanıtı işle
                // Örneğin, tabloyu güncelleyebilirsiniz
                // Burada tabloyu güncellemek için bir işlev çağırabilirsiniz veya doğrudan tablonun içeriğini güncelleyebilirsiniz
                // Örnek olarak:
                // $('#lastikler_tablosu').html(response); // Bu response, sunucudan dönen HTML içeriğini içerir
                console.log('Lastikler başarıyla getirildi:', response);
            },
            error: function(xhr, status, error) {
                // İsteğin başarısız olduğu durumda hata mesajını işle
                console.error('Lastikleri getirirken bir hata oluştu:', error);
            }
        });
    });
});

</script>
<script>
 $(document).ready(function() {
    $('#servis_lastik').on('click', function() {
        // Ajax isteği göndererek veritabanından lastikleri getirme işlemini gerçekleştir
        $.ajax({
            url: 'servis_lastik.php', // Lastikleri getirecek PHP dosyasının yolu
            type: 'GET', // Veri almak için GET isteği kullanıyoruz
            success: function(response) {
                // Lastikleri getirdikten sonra başarılı bir şekilde geri dönen yanıtı işle
                // Örneğin, tabloyu güncelleyebilirsiniz
                // Burada tabloyu güncellemek için bir işlev çağırabilirsiniz veya doğrudan tablonun içeriğini güncelleyebilirsiniz
                // Örnek olarak:
                // $('#lastikler_tablosu').html(response); // Bu response, sunucudan dönen HTML içeriğini içerir
                console.log('Lastikler başarıyla getirildi:', response);
            },
            error: function(xhr, status, error) {
                // İsteğin başarısız olduğu durumda hata mesajını işle
                console.error('Lastikleri getirirken bir hata oluştu:', error);
            }
        });
    });
});
</script>


<script>
    

$(document).ready(function() {
    $('#lastik_cıkart').on('click', function() {
        // Ajax isteği göndererek veritabanından lastikleri getirme işlemini gerçekleştir
        $.ajax({
            url: 'lastik_cıkart.php', // Lastikleri getirecek PHP dosyasının yolu
            type: 'GET', // Veri almak için GET isteği kullanıyoruz
            success: function(response) {
                // Lastikleri getirdikten sonra başarılı bir şekilde geri dönen yanıtı işle
                // Örneğin, tabloyu güncelleyebilirsiniz
                // Burada tabloyu güncellemek için bir işlev çağırabilirsiniz veya doğrudan tablonun içeriğini güncelleyebilirsiniz
                // Örnek olarak:
                // $('#lastikler_tablosu').html(response); // Bu response, sunucudan dönen HTML içeriğini içerir
                console.log('Lastikler başarıyla çıkartıldı:', response);
            },
            error: function(xhr, status, error) {
                // İsteğin başarısız olduğu durumda hata mesajını işle
                console.error('Lastikleri getirirken bir hata oluştu:', error);
            }
        });
    });
});
</script>




<script>
    function openDisDerinligiPage(carId, tireId) {
        var url = 'dis_derinligi.php?car_id=' + carId + '&tire_id=' + tireId;
        window.open(url, '_blank', 'width=600,height=400');
    }
</script>
<script>
    function openKMBilgiPage(carId, tireId) {
        var url = 'km_bilgi.php?car_id=' + carId + '&tire_id=' + tireId;
        window.open(url, '_blank', 'width=600,height=400');
    }
</script>
<script>
    function openBasıncBilgiPage(carId, tireId) {
        var url = 'basınc_bilgi.php?car_id=' + carId + '&tire_id=' + tireId;
        window.open(url, '_blank', 'width=600,height=400');
    }
</script>
<script>
    function openGecmisPage(carId, tireId) {
        var url = 'tire_gecmis.php?car_id=' + carId + '&tire_id=' + tireId;
        window.open(url, '_blank', 'width=600,height=400');
    }
</script>
<script>
    function openCıkart(carId, tireId) {
        var url = 'lastik_cıkart.php?car_id=' + carId + '&tire_id=' + tireId;
        window.open(url, '_blank', 'width=600,height=400');
    }
</script>
<script>
       
        function openPopup(url, width, height) {
    // Pop-up penceresini aç
    window.open(url, 'Depodan Lastik Getir', 'scrollbars=yes,resizable=yes,width=' + width + ',height=' + height);
}

        
    </script>
 
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

<!-- Add this script at the end of the HTML body -->
<!-- Add this script at the end of your HTML body -->
<!-- Add this script at the end of your HTML body -->

<script>
   // Edit Button Click Event
$(document).on('click', '.edit-btn', function() {
    var tireId = $(this).data('tire-id');

    // Set the hidden tire ID
    $('#hidden_tire_id').val(tireId);

    // Your existing AJAX code here to fetch tire details...
    $.ajax({
        url: 'get_tire_details.php',
        type: 'POST',
        data: { tire_id: tireId },
        dataType: 'json',
        success: function(response) {
            // Populate the form fields with the fetched data
            $('input[name="tier_serino"]').val(response.tire_serino);
            $('select[name="tier_marka"]').val(response.tire_marka);
            $('select[name="tier_desen"]').val(response.tire_desen);
            $('select[name="tier_olcu"]').val(response.tire_olcu);
            $('input[name="tier_disderinligi"]').val(response.tire_disderinligi);
            $('select[name="tier_durum"]').val(response.tire_durum);
            $('input[name="tier_olcumtarihi"]').val(response.tire_olcumtarihi);
            $('input[name="tier_olcumkm"]').val(response.tire_olcumkm);
            $('input[name="firma"]').val(response.firma);
            
            $('input[name="tier_position"]').val(response.tire_position);
            
             $('#preview-image').attr('src', 'data:image/jpeg;base64,' + response.tire_resim_path).addClass('resized-image');
              


            // Scroll to the form section or highlight it as needed
            // Example: $('html, body').animate({ scrollTop: $('#contactForm').offset().top }, 'slow');
        },
        error: function(error) {
            console.error('Error fetching tire details:', error);
        }
    });
});
$(document).on('click', '#update_tire_details', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Get the tire_id from the hidden input field
    var tireId = $('#hidden_tire_id').val();
    

    // Get the file input element
    var fileInput = $('input[name="tier_resim_path"]')[0].files[0];
    
    // Check if a file is selected
    if (fileInput) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Get the base64 data of the file
            
            var base64Image = e.target.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

            
            // Send the updated tire details to the PHP file including the base64 image data
            $.ajax({
                url: 'update_tire_details.php',
                type: 'POST',
                data: {
                    update: true,
                    tire_id: tireId,
                    tier_serino: $('input[name="tier_serino"]').val(),
                    tier_marka: $('select[name="tier_marka"]').val(),
                    tier_desen: $('select[name="tier_desen"]').val(),
                    tier_olcu: $('select[name="tier_olcu"]').val(),
        
                    tier_durum: $('select[name="tier_durum"]').val(),
                    tier_olcumtarihi: $('input[name="tier_olcumtarihi"]').val(),
                    tier_olcumkm: $('input[name="tier_olcumkm"]').val(),
                    firma: $('input[name="firma"]').val(),
                    tier_position: $('input[name="tier_position"]').val(),
                    tier_resim_path: base64Image, // Include the base64 image data
                    // Include any other fields you need to update
                },
                success: function(response) {
                   // Show the response from the server
                    // Additional logic if neede
                    alert(response);
                },
                error: function(error) {
                    console.error('Error updating tire details:', error);
                }
            });
        };
        window.location.reload();

        // Read the file as a data URL which results in base64 format
        reader.readAsDataURL(fileInput);
    } else {
        respponseMessage= null;
        // If no file is selected, send the updated tire details without the image data
        $.ajax({
            url: 'update_tire_details.php',
            type: 'POST',
            data: {
                update: true,
                tire_id: tireId,
                tier_serino: $('input[name="tier_serino"]').val(),
                tier_marka: $('select[name="tier_marka"]').val(),
                tier_desen: $('select[name="tier_desen"]').val(),
                tier_olcu: $('select[name="tier_olcu"]').val(),
               
                tier_durum: $('select[name="tier_durum"]').val(),
                tier_olcumtarihi: $('input[name="tier_olcumtarihi"]').val(),
                tier_olcumkm: $('input[name="tier_olcumkm"]').val(),
                firma: $('input[name="firma"]').val(),
                tier_position: $('input[name="tier_position"]').val(),
                // Include any other fields you need to update
            },
            success: function(response) {
                respponseMessage=response;
                 // Show the response from the server
                // Additional logic if needed
               window.location.reload();
              
            },
            error: function(error) {
                console.error('Error updating tire details:', error);
            }
        });
        if(error!=null){
            alert(respponseMessage);
        }
    }
});

</script>


<script>
$(document).ready(function(){
    $('.edit-btn').click(function(){
        $('button[name="save_tier_barkodno1"]').attr('hidden', true);
    });
});
</script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    var tableRows = document.querySelectorAll("#lastiks tbody tr");
    
    tableRows.forEach(function(row) {
        var position = row.cells[0].innerText.trim();
        var radioButton = document.querySelector("input[type='radio'][value='" + position + "']");
        
        if (radioButton) {
            radioButton.checked = true;
        }
    });
});
</script>









 <!-- Kullanılan js -->
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/i18n/jquery-ui-i18n.min.js"></script>
<script>
    $(document).ready(function(){
        $("#tier_olcumtarihi").datepicker({
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