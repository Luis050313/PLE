<?php
include("../conexion.php");
//Datos del formulario
$numeroControl  = $_POST['numeroControl'] ?? '';
$tipo           = $_POST['tipo'] ?? '';
//Tratar de eliminar
try {
    $conn->begin_transaction();
    if($tipo==1){//Auxiliar
        $conn->query("DELETE usuarios WHERE numerocontrol = $numeroControl");
        $conn->execute();
        $conn->query("DELETE personas WHERE numerocontrol = $numeroControl");
        $conn->execute();

    }else if($tipo==2){//Alumno
        $conn->query("DELETE usuarios WHERE numerocontrol = $numeroControl");
        $conn->execute();
        $conn->query("DELETE carrerasalumnos WHERE numerocontrol = $numeroControl");
        $conn->execute();
        $conn->query("DELETE personas WHERE numerocontrol = $numeroControl");
        $conn->execute();

    }else if($tipo==3){//Profesor
        $conn->query("DELETE profesores WHERE numerocontrol = $numeroControl");
        $conn->execute();
    }
    $conn->commit();
    echo "Eliminado correctamente ✅";
} catch (Exception $e) {
    $conn->rollback();
    if($tipo==1 || $tipo==2){ //Auxiliar o Alumno
        $conn->query("UPDATE usuarios SET id_estado = 2 WHERE numerocontrol = $numeroControl");
        $conn->execute();
        $conn->query("UPDATE personas SET id_estado = 2 WHERE numerocontrol = $numeroControl");
        $conn->execute();
    }else if($tipo==3){ //Profesor
        $conn->query("UPDATE profesores SET id_estado = 2 WHERE numerocontrol = $numeroControl");
        $conn->execute();
    }
    echo "Desactivado correctamente ✅";
}
$conn->close();
?>
