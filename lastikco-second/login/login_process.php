<?php
  require_once('../database/db_conn.php');
  
session_start();

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get user input
    $username = $_POST["username"];
    $password = $_POST["password"];


    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        // Authentication successful
        $_SESSION["username"] = $username;
        header("Location: ../index.php");
        exit();
    } else {
        // Invalid credentials, you might want to show an error message
        echo "Invalid username or password";
    }

    $conn->close();
}
?>
