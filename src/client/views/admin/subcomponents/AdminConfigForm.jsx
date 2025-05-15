import { config } from '@fortawesome/fontawesome-svg-core';
import React, { Component } from 'react';
import { fetchGet, fetchPut } from '../../../util';
import toast from 'react-hot-toast';


export default class AdminConfigForm extends Component {
    constructor(props) {
        super(props);
        const { configValues } = this.props;
        this.state = {
            configValues: { ...props.configValues }, 
        };    
    }
            
    componentDidUpdate(prevProps) {
        if (prevProps.configValues !== this.props.configValues) {
            this.setState({ configValues: { ...this.props.configValues } });
        }
    }

    handleSubmit (e) {
        e.preventDefault();
        const { configValues } = this.state;
        const { reloadPage } = this.props;
        const loadingToast = toast.loading('Guardando configuración...');
        fetchPut('/api/admin/update/config', { config: configValues })
        .then(r => (r?.status === 200) && r.json())
		.then((res) =>  res ? toast.success('Configuración actualizada.', { id: loadingToast }) : toast.dismiss(loadingToast))
        .then(() => {
                reloadPage();})
    }

    render() {

        const { currentAcademicYear, disableVotes, automaticEmails } = this.state.configValues;

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
                        onChange={(e) => {
                            const currentAcademicYearValue = e.target.value; 
                            this.setState((prevState) => ({
                                configValues: { ...prevState.configValues, currentAcademicYear: currentAcademicYearValue },
                            }));
                        }}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="disableVotes">Desactivar Votos:</label>
                    <input
                        type="checkbox"
                        id="disableVotes"
                        checked={disableVotes}
                        onChange={(e) =>{
                            const disableVotesChecked = e.target.checked;
                            this.setState((prevState) => ({
                                configValues: { ...prevState.configValues, disableVotes: disableVotesChecked },
                            }))
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="automaticEmails">Emails Automáticos:</label>
                    <input
                        type="checkbox"
                        id="automaticEmails"
                        checked={automaticEmails}
                        onChange={(e) => {
                            const automaticEmailsChecked = e.target.checked;
                            this.setState((prevState) => ({
                                configValues: { ...prevState.configValues, automaticEmails: automaticEmailsChecked },
                            }))
                        }}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
        );
    }
}
