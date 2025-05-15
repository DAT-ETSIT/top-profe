import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { fetchGet } from '../../util';
import AdminConfigForm from './subcomponents/AdminConfigForm';
import ResetUsersForm from './subcomponents/AdminResetUsersForm';
import DeleteVotesForm from './subcomponents/AdminDeleteVotesForm';

function AdminEditConfigView(ComponentClass) {
    return (props) => <ComponentClass {...props} params={useParams()} />;
}

class AdminEditConfigClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            configValues: {
                currentAcademicYear: '',
                disableVotes: false,
                automaticEmails: false,
            },
        };
    }

    componentDidMount() {
        this.loadConfig();
    }

    loadConfig() {
        fetchGet('/api/config')
            .then((r) => (r?.status === 200) && r.json())
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
        
    }

    handleFormSubmit = () => {
        this.setState({ isLoaded: false });;
        this.loadConfig();
    };

    render() {
            const { isLoaded, configValues } = this.state;

            if (!isLoaded) return <div className="full-width">Cargando...</div>;

            return (
                <>
                    <h1 className="centered">Editar configuración</h1>
                    <AdminConfigForm
                        configValues={configValues}
                        reloadPage={this.handleFormSubmit}
                    />
                    <hr />
                    <ResetUsersForm reloadPage={this.handleFormSubmit} />
                    <hr />
                    <DeleteVotesForm
                        currentAcademicYear={configValues.currentAcademicYear}
                        reloadPage={this.handleFormSubmit}
                    />
                </>
            );
        }
    }

export default AdminEditConfigView(AdminEditConfigClass);