<?php
include("../conexion.php"); // Conexión a la BD

$id              = $conn->real_escape_string($_POST['id'] ?? '');
$numeroControl   = $conn->real_escape_string($_POST['numeroControl'] ?? '');
$nombre          = $conn->real_escape_string($_POST['nombre'] ?? '');
$apellidoPaterno = $conn->real_escape_string($_POST['apellidoPaterno'] ?? '');
$apellidoMaterno = $conn->real_escape_string($_POST['apellidoMaterno'] ?? '');
$carrera         = $conn->real_escape_string($_POST['carrera'] ?? '');
$clave           = $conn->real_escape_string($_POST['clave'] ?? '');

// Verificar si ya existe
$check = $conn->query("SELECT 1 FROM personas WHERE numeroControl = '$numeroControl' UNION 
                       SELECT 2 FROM profesores WHERE id_profesor = '$numeroControl' ");

if($check->num_rows === 0){
    // No existe → Insert
    try{
        if($id == 1 || $id == 2){ // Auxiliar o Alumno
            $conn->query("INSERT INTO personas (numeroControl, id_Rol, id_Estado, nombre, apellidoPaterno, apellidoMaterno)
                         VALUES ('$numeroControl','$id',1,'$nombre','$apellidoPaterno','$apellidoMaterno')");
            
            //Clave encriptada
            $hash = password_hash($clave, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO usuarios (id_Estado, numeroControl, Clave) VALUES ('1',?,?)");
            $stmt->bind_param("is", $numeroControl, $hash); // El primer parámetro es numérico (i), el segundo string (s)
            $stmt->execute();

            if($id == 2){
                $conn->query("INSERT INTO CarrerasAlumnos (numeroControl, id_Carrera) VALUES ('$numeroControl','$carrera')");
            }
        } elseif($id == 3){ // Profesor
            $conn->query("INSERT INTO Profesores (id_Profesor, id_Estado, nombre, apellidoPaterno, apellidoMaterno)
                         VALUES ('$numeroControl',1,'$nombre','$apellidoPaterno','$apellidoMaterno')");
        }

        echo "Guardado correctamente ✅";

    } catch (mysqli_sql_exception $e){
        echo "⚠️ Error al guardar: " . $e->getMessage();
    }
    $conn->close();
}else{
    echo "⚠️ Advertencia Usuario Duplicado ->" ;
    //Si ya existe se modifican y se activa el usuario de nuevo
    include("modificar.php");
}
?>
