<?php
include('login/userlogin.php'); 
require_once('database/db_conn.php');
$car_name = "";
$car_model = ""; // Add a semicolon here
$car_id = 0; // Add a semicolon here
$edit_state = false;
if (isset($_POST['save'])) {
    $car_name = $_POST['car_name'];
    $car_model = $_POST['car_model'];
    $sql = "INSERT INTO data (car_name, car_model) VALUES ('$car_name', '$car_model')";
    if (mysqli_query($conn, $sql)) {
        $_SESSION['message'] = "Data Saved Successfully";
        header("Location: caredit.php");
    } else {
        mysqli_close($conn);
    }
}

// For updating records
if (isset($_POST['update'])) {
    $car_id = $_POST['car_id'];
    $car_name = $_POST['car_name'];
    $car_model = $_POST['car_model'];
    mysqli_query($conn, "UPDATE cars SET car_name='$car_name', car_model='$car_model' WHERE car_id=$car_id");
    $_SESSION['message'] = "Data Updated Successfully";
    header('location: caredit.php');
}

// For deleting records
if (isset($_GET['delete'])) {
    $car_id = $_GET['delete'];
    mysqli_query($conn, "DELETE FROM cars WHERE car_id=$car_id");
    $_SESSION['message'] = "Data Deleted Successfully";
    header('location: caredit.php');
}
?>
