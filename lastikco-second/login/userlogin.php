<?php
session_start();

// Check if the user is not logged in
if (!isset($_SESSION["username"])) {
    // Redirect to the login page
    header("Location: login/login.php");
    exit();
}
$usernames = $_SESSION["username"];

// Kullanıcı adını kullanarak başka işlemler yapabilirsiniz


?>