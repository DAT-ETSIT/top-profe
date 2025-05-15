import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../../subcomponents/Modal';
import { fetchDelete } from '../../../util';

export default function ResetUsersForm({ reloadPage }) {
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);

    const resetUsers = () => {
        setShowResetConfirmation(false);
        const loadingToast = toast.loading('Reseteando usuarios...');
        fetchDelete(`/api/admin/users/reset`, {})
            .then(r => (r?.status === 200) && r.json())
            .then(() => {
                toast.dismiss(loadingToast);
                toast.success('Usuarios reseteados correctamente');
                reloadPage();;
            })
            .catch(() => {
                toast.dismiss(loadingToast);
                toast.error('Error al resetear usuarios');
            });
    };

    return (
        <>
            <h2 className="centered">Resetear usuarios</h2>
            <p className="centered">
                Esta opción eliminará la elección de grado de todos los usuarios y desactivará aquellos que no sean administradores.
                <br />
                <strong>¡Ten cuidado! Esto no se puede deshacer.</strong>
            </p>
            <p className="centered">
                <button type="button" className="resetUsers" onClick={() => setShowResetConfirmation(true)}>
                    Resetear usuarios
                </button>
            </p>
            <Modal show={showResetConfirmation} allowClose onClose={() => setShowResetConfirmation(false)}>
                <h2>¿Estás seguro de que quieres resetear los usuarios?</h2>
                <p>Esta acción no es reversible.</p>
                <button type="button" className="box main-button menu-item" onClick={resetUsers}>
                    Resetear usuarios
                </button>
            </Modal>
        </>
    );
}