<?php
include "database/db_conn.php";

$car_id = $_GET["car_id"];

// Check if the user has confirmed the deletion
if (isset($_GET['confirm']) && $_GET['confirm'] == 'true') {
    // Continue with the deletion process

    // Delete related records in tire_details table
    $deleteTireDetailsSql = "DELETE FROM tire_details WHERE tire_id IN (SELECT tire_id FROM tires WHERE car_id = $car_id)";
    $resultTireDetails = mysqli_query($conn, $deleteTireDetailsSql);

    if (!$resultTireDetails) {
        echo "Failed to delete related tire_details records: " . mysqli_error($conn);
        exit();
    }

    // Delete related records in tires table
    $deleteTiresSql = "DELETE FROM tires WHERE car_id = $car_id";
    $resultTires = mysqli_query($conn, $deleteTiresSql);

    if (!$resultTires) {
        echo "Failed to delete related tires records: " . mysqli_error($conn);
        exit();
    }

    // Delete related records in axles table
    $deleteAxlesSql = "DELETE FROM axles WHERE car_id = $car_id";
    $resultAxles = mysqli_query($conn, $deleteAxlesSql);

    if (!$resultAxles) {
        echo "Failed to delete related axles records: " . mysqli_error($conn);
        exit();
    }

    // Now delete the record in the cars table
    $deleteCarsSql = "DELETE FROM cars WHERE car_id = $car_id";
    $resultCars = mysqli_query($conn, $deleteCarsSql);

    if ($resultCars) {
        header("Location: addcar.php?msg=Data deleted successfully");
    } else {
        echo "Failed to delete car record: " . mysqli_error($conn);
    }

} else {
    // Display confirmation popup with car_id information
    echo "<script>
            var userConfirmed = confirm('Aracı Silmek İstiyormusunuz');

            if (userConfirmed) {
                window.location.href = 'deletecar.php?car_id=$car_id&confirm=true';
            } else {
                // User cancelled the deletion
                window.location.href = 'addcar.php';
            }
          </script>";
}
?>
