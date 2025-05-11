/* eslint-disable max-len */
import React, {Component} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { fetchGet, fetchDelete } from '../../util';
import AdminConfigForm from './subcomponents/AdminConfigForm';
import Modal from '../subcomponents/Modal';

function AdminEditConfigView(ComponentClass) {
    return props => <ComponentClass {...props} params={useParams()} />;
}

class AdminEditConfigClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            object: {},
            configValues: {
                currentAcademicYear: '',
                disableVotes: false,
                automaticEmails: false,
            },
            showConfirmation: false,
        };
    }

    componentDidMount() {
        this.loadConfig();
        }

    loadConfig () {
        fetchGet('/api/config')
            .then(r => (r?.status === 200) && r.json())
            .then((res) => {
                this.setState({
                    configValues: {
                        currentAcademicYear: res.currentAcademicYear,
                        disableVotes: res.disableVotes,
                        automaticEmails: res.automaticEmails,
                    },
                    isLoaded: true,
                });
            });
    };

    resetUsers() {
        this.setState({
            showConfirmation: false
        });

        const loadingToast = toast.loading('Reseteando usuarios...');
        fetchDelete(`/api/admin/users/reset`, {})
            .then(r => (r?.status === 200) && r.json())
            .then((res) => {
                toast.dismiss(loadingToast);
                toast.success('Usuarios reseteados correctamente');
            })
            .catch((err) => {
                toast.dismiss(loadingToast);
                toast.error('Error al resetear usuarios');
            });
    }


    render () {
        const {
            isLoaded, configValues, showConfirmation,
        } = this.state;

        if (!isLoaded) return (<div className="full-width">Cargando...</div>);

        return (
            <>
                <h1 className="centered">Editar configuración</h1>
                
                <AdminConfigForm configValues={configValues} description= "Aquí se muestra un formulario para editar los parámetros almacenados en la BBDD"/>

                <hr />
                <h2 className="centered">Resetear usuarios</h2>
                <p className="centered">
                    Esta opción eliminará la elección de grado de todos los usuarios y desactivará aquellos que no sean administradores.
                    <br />
                    <strong>¡Ten cuidado! Esto no se puede deshacer.</strong>
                </p>
                <p className="centered">
                    <button type="button" className="resetUsers" onClick={() => this.setState({ showConfirmation: true })}>
                        Resetear usuarios
                    </button>
                </p>
                <Modal show={showConfirmation} allowClose onClose={() => this.setState({ showConfirmation: false })}>
					<h2>¿Estás seguro de que quieres resetear los usuarios?</h2>
					<p>Esta acción no es reversible.</p>
					<button type="button" className="box main-button menu-item" onClick={() => this.resetUsers()}>
						Resetear usuarios
					</button>
				</Modal>
            </>
        );
    }
}

export default AdminEditConfigView(AdminEditConfigClass);