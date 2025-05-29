<?php

    class CustomResponseBuilder {

        public static function build(
            $resultado, 
            $mensaje, 
            $identificador, 
            $httpCode,
            $error = null, 
            $errCode = null,
            $data = null) {

            $response = [
                "success" => $resultado,
                "mensaje" => $mensaje,
                "id" => $identificador,
                "httpCode" => $httpCode,
                "data" => $data
            ];

            if (!is_null($error)) {
                $response["error"] = $error;
                $response["errCode"] = $errCode;
            }

            return $response;
        }
    }

    /**
     * SCHEMA:
     * {
     *  "success" : boolean          //indica si la operacion fue exitosa o no
     *  "mensaje" : string           //descripcion breve del resultado de la operacion
     *  "id"      : string | number  //si la operacion recibe o envia un identificador, en caso contrario es null
     *  "httpCode": number           //codigo de respuesta http
     *  "data"    : any              //datos solicitados o null
     *  "error"   : string           //descripcion del error o null
     *  "errCode" : number           //codigo del error si fue un error de SQL o null
     * }
     */
?>