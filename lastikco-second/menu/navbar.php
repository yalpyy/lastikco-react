<?php
require_once('database/db_conn.php');
include('login/userlogin.php');?>
  <div class="topbar">
                  <nav class="navbar navbar-expand-lg navbar-light">
                     <div class="full">
                        <button type="button" id="sidebarCollapse" class="sidebar_toggle"><i class="fa fa-bars"></i></button>
                        <div class="logo_section">
                           <a href="index.php"><img class="img-responsive" src="images/logo/logo.png" alt="#" /></a>
                        </div>
                        <div class="right_topbar">
                            <div class="icon_info">
                              <ul>
                               
                              </ul> 
                              <ul class="user_profile_dd">
                                 <li>
                                    <a class="dropdown-toggle" data-toggle="dropdown"><img class="img-responsive rounded-circle" src="images/layout_img/user_img.jpg" alt="#" /><span class="name_user"> <?php echo $usernames ?></span></a>
                                    <div class="dropdown-menu">
                                       <a class="dropdown-item" href="index.php">Anasayfa</a>
                                    
                                       <a class="dropdown-item" href="destek.php">Destek Talebi</a>
                                       <a class="dropdown-item" href="login/logout.php"><span>Çıkış Yap</span> <i class="fa fa-sign-out"></i></a>
                                    </div>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </nav>
               </div>
               <!-- end topbar -->

<nav id="sidebar">
               <div class="sidebar_blog_1">
                  <div class="sidebar-header">
                     <div class="logo_section">
                        <a href="index.php"><img class="logo_icon img-responsive" src="images/logo/logo_icon.png" alt="#" /></a>
                     </div>
                  </div>
                  <div class="sidebar_user_info">
                     <div class="icon_setting"></div>
                     <div class="user_profle_side">
                        <div class="user_img"><img class="img-responsive" src="images/layout_img/user_img.jpg" alt="#" /></div>
                        <div class="user_info">
                           <h6>Lastik.co </h6>
                           <p><span class="online_animation"></span> <?php echo $usernames ?> Online  </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="sidebar_blog_2">
                  <h4>Lastik.co  </h4>
                  <ul class="list-unstyled components">
                  <li><a href="index.php"><i class="fa fa-road yellow_color"></i> <span>Anasayfa</span></a></li>
                 
                     <li class="active">
                        <a href="#dashboard" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-car purple_color2"></i> <span>Araç İşlemleri</span></a>
                        <ul class="collapse list-unstyled" id="dashboard">
                        
                           <li>
                             <a href="newcar.php">> <span>Araç Ekle</span></a>
                             <a href="addcar.php">> <span>Aktif Araç İşlemleri</span></a>
                             <a href="pasifcar.php">> <span>Pasif Araç İşlemleri</span></a>
                              
                           </li>
                     
                        </ul>
                     </li>
                  
                  
                     <li>
                        <a href="#element" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-life-ring purple_color"></i> <span>Lastik İşlemleri</span></a>
                        <ul class="collapse list-unstyled" id="element">
                           
                           <!--<li><a href="lastiksorgulama.php">> <span>Lastik Sorgulama</span></a></li>-->
                           <!-- <li><a href="lastikislem.php">> <span>Lastik Bilgi Değişme</span></a></li>-->
                            <li><a href="newtire.php">> <span>Sıfır Lastik Ekle</span></a></li>
                            <li><a href="depodaki_lastikler.php">> <span>Depodaki Lastikler</span></a></li>
                            <li><a href="servis_lastik.php">> <span>Servisteki Lastikler</span></a></li>
                     
                            <li><a href="hurda_lastikler.php">> <span>Hurda Lastikler</span></a></li>
                           <!-- <li><a href="lastikcıkar.php">> <span>Barkoddan Lastik Çıkar</span></a></li>-->
                           
                        </ul>
                     </li>
                     <li>
                        <a href="#apps" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-wrench blue2_color"></i> <span>Akü İşlemleri</span></a>
                        <ul class="collapse list-unstyled" id="apps">
                        <li><a href="depoaku.php">> <span>Akü Ekleme / Depo</span></a></li>
                          <!--  <li><a href="akuekle.php">> <span>Akü Ekle</span></a></li> -->
                           <!-- <li><a href="akucıkar.php">> <span>Akü Çıkar</span></a></li> -->
                          
                        </ul>
                     </li>
                     <li>
                        <a href="#additional_page" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-road blue2_color"></i> <span>Diğer İşlemler</span></a>
                        <ul class="collapse list-unstyled" id="additional_page">
                        <li><a href="newregion.php">> <span>Yeni Bölge Ekleme</span></a></li>
                        <li><a href="lastikbilgi.php">> <span>Lastik Bilgi Ekleme</span></a></li>                       
                        </ul>
                     </li>
                  
                       
                     
                  </ul>
               </div>
            </nav>


           