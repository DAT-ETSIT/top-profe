/* eslint-disable max-len */
import React from 'react';
import AdminConfigForm from './subcomponents/AdminConfigForm';

export default function AdminEditConfigView() {
    return (
        <>
            <h1 className="centered">Editar configuración</h1>
            
            <AdminConfigForm description= "Aquí se muestra un formulario para editar los parámetros almacenados en la BBDD"/>

            <hr />
            <h2 className="centered">Resetear usuarios</h2>
            <p className="centered">
                Esta opción eliminará todos los usuarios de la base de datos y los volverá a crear a partir de los datos de la API.
                <br />
                <strong>¡Ten cuidado! Esto no se puede deshacer.</strong>
            </p>
            <p className="centered">
                <button type="button" className="btn btn-danger" onClick={() => alert('Resetting users...')}>
                    Resetear usuarios
                </button>
            </p>

        </>
    );
}