import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../../subcomponents/Modal';
import { fetchDelete } from '../../../util';

export default function DeleteVotesForm({ currentAcademicYear, reloadPage }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    const deleteVotes = (e) => {
        e.preventDefault();
        setShowDeleteConfirmation(false);
        const loadingToast = toast.loading('Borrando votos...');
        fetchDelete(`/api/admin/votes/delete`, { deletePassword, academicYear: currentAcademicYear })
            .then(r => (r?.status === 200) && r.json())
            .then(() => {
                toast.dismiss(loadingToast);
                toast.success('Votos borrados correctamente');
                setDeletePassword(''); 
                reloadPage();
            })
            .catch(() => {
                toast.dismiss(loadingToast);
                toast.error('Error al borrar votos');
            });
    };

    return (
        <>
            <h2 className="centered">Resetear votos del curso {currentAcademicYear}</h2>
            <p className="centered">
                Esta opción eliminará todos los votos emitidos hasta ahora para el curso actual. Está hecha para borrar los votos de prueba antes de anunciarlo a la escuela.
                <br />
                <strong>¡Ten MUCHO cuidado! Esto no se puede deshacer.</strong>
            </p>
            <p className="centered">
                <button type="button" className="resetUsers" onClick={() => setShowDeleteConfirmation(true)}>
                    Borrar votos.
                </button>
            </p>
            <Modal show={showDeleteConfirmation} allowClose onClose={() => setShowDeleteConfirmation(false)}>
                <h2>¿Estás seguro de que quieres borrar los votos del curso {currentAcademicYear}?</h2>
                <p>Esta acción NO es reversible.</p>
                <form className="box" onSubmit={deleteVotes}>
                    <input
                        type="text"
                        className="box"
                        placeholder="Escribe la contraseña para borrar."
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                    <button type="submit" className="box main-button menu-item">
                        Borrar votos {currentAcademicYear}
                    </button>
                </form>
            </Modal>
        </>
    );
}