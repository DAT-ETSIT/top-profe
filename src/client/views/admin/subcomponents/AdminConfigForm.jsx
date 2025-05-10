import { config } from '@fortawesome/fontawesome-svg-core';
import React, { Component } from 'react';
import { fetchGet, fetchPut } from '../../../util';
import toast from 'react-hot-toast';


export default class AdminConfigForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            object: {},
            configValues: {
                currentAcademicYear: '',
                disableVotes: false,
            },
        };
    }

    componentDidMount() {
            this.loadConfig();
        }

    loadConfig() {
            fetchGet('/api/config')
                .then(r => (r?.status === 200) && r.json())
                .then((res) => {
                    this.setState({
                        configValues: res,
                        isLoaded: true,
                    });
                });
        };

    setCurrentAcademicYear(value) {
        this.setState(function(prevState) {
            return {
                configValues: {
                    ...prevState.configValues,
                    currentAcademicYear: value,
                },
            };
        });
    }

    setDisableVotes(value) {
        this.setState(function(prevState) {
            return {
                configValues: {
                    ...prevState.configValues,
                    disableVotes: value,
                },
            };
        });
    }

    handleSubmit (e) {
        e.preventDefault();
        const configValues = this.state.configValues;
        const loadingToast = toast.loading('Guardando configuración...');
        console.log('Config values:', configValues);
        fetchPut('/api/admin/update/config', { config: configValues })
        .then(r => (r?.status === 200) && r.json())
		.then((res) =>  res ? toast.success('Configuración actualizada.', { id: loadingToast }) : toast.dismiss(loadingToast))
		.finally(() => this.loadUsers());
    }

    render() {
        const { isLoaded } = this.state;
        const { currentAcademicYear, disableVotes } = this.state.configValues;


        if (!isLoaded) return (<div className="full-width">Cargando...</div>);

        return (
            <div>
            <h2 className="centered">Configuración de años y votos</h2>
            <form onSubmit= {(e) => this.handleSubmit(e)}>
                <div>
                    <label htmlFor="currentAcademicYear">Current Academic Year:</label>
                    <input
                        type="text"
                        id="currentAcademicYear"
                        value={currentAcademicYear}
                        onChange={(e) => this.setCurrentAcademicYear(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="disableVotes">Disable Votes:</label>
                    <input
                        type="checkbox"
                        id="disableVotes"
                        checked={disableVotes}
                        onChange={(e) => this.setDisableVotes(e.target.checked)}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
        );
    }
}
