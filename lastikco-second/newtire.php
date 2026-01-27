<!DOCTYPE html>
<html lang="en">
<?php include 'menu/navbar.php';?>
<?php 
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
<!-- Add this inside the head section or in your existing style block -->
<style>
    .resized-image {
        max-width: 300px;  /* Set the maximum width to 100% of its parent container */
        max-height: 300px;  /* Set the maximum height to your desired value */
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
   
     
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css">
    

    


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
                              <h2>Depoya Sıfır Lastik Ekle </h2>
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
													<label class="label" for="#">Diş Derinliği</label>
                                                    <input type="text" class="form-control" name="tier_disderinligi" placeholder="Diş Derinliği">
                                                
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
                                                    <input type="text" class="form-control" id="tier_olcumtarihi"name="tier_olcumtarihi" placeholder="Ölçüm Tarihi">
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
													<label class="label" for="#">Firma</label>
                                                    <input type="text" class="form-control" name="firma" placeholder="Firma">
												</div>
											</div>
                                            <div class="col-md-6">
												<div class="form-group">
                                                <button type="submit" class="btn btn-primary" name="save_tier_barkodno1">Kaydet</button>
                                                <a href="addcar.php" class="btn btn-danger">Geri Dön</a>
                                                <button type="button" class="btn btn-success" id="update_tire_details">Güncelle</button>
                                                
                                                
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
  

                                
											
										</div>
									</form>
								</div>
							</div>
							<div class="col-lg-4 col-md-5 d-flex align-items-stretch" >
								                                              <!-- Add this inside the form or wherever you want to display the image -->
<div class="col-md-6 " >
    <div class="form-group" >
    
        <img id="preview-image" src="" alt="Lastik Görseli" style="max-width: 100%; height: 100%; margin-top:80px; margin-left:100px">

    </div>
</div>

		                    </div>
               <!-- end dashboard inner -->
                    </div>
                    
                 </div>

        
                 <div> <!-- AraçtakiLastikler -->
                 <div class="midde_cont" style="margin-top: 50px;">
                 
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
    $disDerinligi = $_POST['tier_disderinligi'];
    $durum = $_POST['tier_durum'];
    $olcumTarihi = $_POST['tier_olcumtarihi'];
    $olcumKM = $_POST['tier_olcumkm'];
    $firma = $_POST['firma'];


    // Resim dosyası var mı kontrol et
   

    // Tires tablosuna veri ekleyin

        $tiresSql = "INSERT INTO tires (car_id, created_by, created_date) VALUES (NULL, '$usernames', NOW())"; // car_id'yi NULL olarak ayarla

        
        if ($conn->query($tiresSql) === TRUE) {
            $tire_id = $conn->insert_id;

            $tireDetailsSql = "INSERT INTO tire_details (tire_id, tire_serino, tire_marka, tire_desen, tire_olcu, tire_disderinligi, tire_durum, tire_olcumtarihi, tire_olcumkm,firma, tire_resim_path, created_by, created_date) 
                                VALUES ('$tire_id', '$seriNo', '$marka', '$desen', '$olcu', '$disDerinligi', '$durum', '$olcumTarihi', '$olcumKM','$firma', ?, '$created_by', NOW())";

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
   

    $conn->close();
}
?>

                
                
                    <!-- Continue with the rest of your dashboard content -->
                    <div class="mb-3">
            
        </div>
                    <?php
                    // Veritabanı bağlantı bilgileri
                    $conn = new mysqli($database_config['servername'], $database_config['username'], $database_config['password'], $database_config['dbname']);

                    if ($conn->connect_error) {
                        die("Bağlantı hatası: " . $conn->connect_error);
                    }

                    // SQL sorgusu
                    $sql = "SELECT td.tire_id, td.tire_serino, td.tire_marka, td.tire_desen, td.tire_olcu, td.tire_disderinligi, td.tire_durum, td.tire_olcumtarihi, td.tire_olcumkm,td.firma, td.tire_resim_path, td.created_by, td.created_date
                    FROM tires t
                    JOIN tire_details td ON t.tire_id = td.tire_id
                    WHERE  t.car_id IS NULL"; // car_id'si NULL olanları da getir
            

                    // Sorguyu çalıştır
                    $result = $conn->query($sql);

                    // Sorgu sonuçlarını kontrol et ve tabloyu yazdır
                    if ($result !== false && $result->num_rows > 0) {
                    ?>
                         <table id="lastiks" class="table table-hover text-center">
                            <thead class="table-dark">
                                <tr>
                                   
                                    <th>Seri No</th>
                                    <th>Marka</th>
                                    <th>Desen</th>
                                    <th>Ölçü</th>
                                    <th>Diş Derinliği</th>
                                    <th>Durum</th>
                                    <th>Ölçüm Tarihi</th>
                                    <th>Ölçüm KM</th>
                                      <th>Firma </th>
                                  <!--  <th>Resim</th> -->
                                    <th>Oluşturan</th>
                                    <th>Oluşturulma Tarihi</th>
                                    <th>Düzenle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                while ($row = $result->fetch_assoc()) {
                                ?>
                                    <tr>
                                        
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
    });





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
        function openPopup(url) {
            window.open(url, 'Depodan Lastik Getir', 'width=600,height=400,scrollbars=yes,resizable=yes');
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
                    tier_marka: $('input[name="tier_marka"]').val(),
                    tier_desen: $('input[name="tier_desen"]').val(),
                    tier_olcu: $('input[name="tier_olcu"]').val(),
                    tier_disderinligi: $('input[name="tier_disderinligi"]').val(),
                    tier_durum: $('select[name="tier_durum"]').val(),
                    tier_olcumtarihi: $('input[name="tier_olcumtarihi"]').val(),
                    tier_olcumkm: $('input[name="tier_olcumkm"]').val(),
                    firma: $('input[name="firma"]').val(),
                
                    tier_resim_path: base64Image, // Include the base64 image data
                    // Include any other fields you need to update
                },
                success: function(response) {
                    alert(response); // Show the response from the server
                    // Additional logic if needed
                },
                error: function(error) {
                    console.error('Error updating tire details:', error);
                }
            });
        };

        // Read the file as a data URL which results in base64 format
        reader.readAsDataURL(fileInput);
    } else {
        // If no file is selected, send the updated tire details without the image data
        $.ajax({
            url: 'update_tire_details.php',
            type: 'POST',
            data: {
                update: true,
                tire_id: tireId,
                tier_serino: $('input[name="tier_serino"]').val(),
                tier_marka: $('input[name="tier_marka"]').val(),
                tier_desen: $('input[name="tier_desen"]').val(),
                tier_olcu: $('input[name="tier_olcu"]').val(),
                tier_disderinligi: $('input[name="tier_disderinligi"]').val(),
                tier_durum: $('select[name="tier_durum"]').val(),
                tier_olcumtarihi: $('input[name="tier_olcumtarihi"]').val(),
                tier_olcumkm: $('input[name="tier_olcumkm"]').val(),
                firma: $('input[name="firma"]').val(),
               
                // Include any other fields you need to update
            },
            success: function(response) {
                alert(response); // Show the response from the server
                // Additional logic if needed
            },
            error: function(error) {
                console.error('Error updating tire details:', error);
            }
        });
    }
});

</script>


 <!-- Kullanılan js -->
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