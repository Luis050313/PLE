<?php
header('Content-Type: application/json');
require 'conexion.php';

// Verificar que se recibieron los datos
if (!isset($_POST['usuario']) || !isset($_POST['password'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

$numeroControl = $_POST['usuario'];
$password = $_POST['password'];

// Preparar consulta segura
$stmt = $conn->prepare("SELECT Clave FROM Usuarios WHERE numeroControl = ?");
$stmt->bind_param("i", $numeroControl);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "⚠️ Usuario no encontrado"]);
    exit;
}

$row = $result->fetch_assoc();
$hash = $row['Clave'];

// Verificar contraseña
if (password_verify($password, $hash)) {
    echo json_encode(["status" => "success", "message" => "✅ Login exitoso"]);
} else {
    echo json_encode(["status" => "error", "message" => "❌ Contraseña incorrecta"]);
}

$stmt->close();
$conn->close();
?>
