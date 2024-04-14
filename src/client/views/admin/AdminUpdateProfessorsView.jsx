/* eslint-disable max-len */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '../subcomponents/Modal';
// eslint-disable-next-line no-unused-vars
import { fetchGet, fetchPost } from '../../util';
import AdminProfessorsList from './subcomponents/AdminProfessorsList';

export default class AdminUpdateProfessorsView extends Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { params: { degreeId } } = match;

		this.state = {
			isLoaded: true,
			isSaved: false,
			professors: {},
			degree: {},
			askYear: true,
			academicYear: '',
			showError: false,
			showConfirmation: false,
		};

		this.degreeId = degreeId;

		this.fetchProfessors = this.fetchProfessors.bind(this);
		this.saveSubjects = this.saveSubjects.bind(this);
	}

	fetchProfessors() {
		const { academicYear } = this.state;

		const re = /^\d{4}-\d{2}$/;
		if (!re.test(academicYear)) {
			this.setState({
				showError: true,
			});
			return;
		}

		fetchGet(`/api/admin/degrees/${this.degreeId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					degree: res,
				});
			});

		fetchGet(`/api/admin/update/professors/${this.degreeId}/${academicYear}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					askYear: false,
					isLoaded: true,
					professors: res,
				});
			});
	}

	saveSubjects(subjects) {
		this.setState({
			showConfirmation: false,
			isLoaded: false,
		});

		fetchPost(`/api/admin/update/subjects/${this.degreeId}`, {
			missingSubjects: subjects,
		})
			.then(r => r.json())
			.then(() => {
				this.setState({
					isLoaded: true,
					isSaved: true,
				});
			});
	}

	render() {
		const {
			isLoaded, isSaved, professors, degree, askYear, academicYear, showError, showConfirmation,
		} = this.state;

		const showErrorClassName = showError ? 'error display-block' : 'error display-none';

		if (askYear) {
			return (
				<Modal show onClose={() => this.setState({ askYear: false })}>
					<h2>Indica el curso académico para realizar la búsqueda</h2>
					<div className="big-input search-input box">
						<input
							type="text"
							placeholder="Curso académico en formato 20XX-YY"
							value={academicYear}
							// eslint-disable-next-line no-restricted-globals
							onChange={() => this.setState({ academicYear: event.target.value })}
						/>
					</div>
					<br />
					<p className={showErrorClassName}>El curso académico introducido no es válido.</p>
					<button type="button" className="box main-button menu-item" onClick={this.fetchProfessors}>
						Iniciar búsqueda
					</button>
				</Modal>
			);
		}

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);
		if (isSaved) return (<Redirect to={`/admin/subjects/${degree.id}`} />);

		return (
			<>
				<h1 className="centered">Actualizar profesores</h1>

				{professors.length > 0 ? (
					<>
						<AdminProfessorsList professors={professors} degree={degree} description={`Aquí se muestra un listado de todos los profesores de la titulación ${degree.id} que no figuran en la base de datos.`} />
						<br />
						<button type="button" className="box main-button menu-item" onClick={() => this.setState({ showConfirmation: true })}>
					Añadir profesores
							<FontAwesomeIcon className="main-button-icon" icon={faPlus} />
						</button>
						<Modal show={showConfirmation} onClose={() => this.setState({ showConfirmation: false })}>
							<h2>¿Estás seguro de que quieres importar estos profesores?</h2>
							<p>Una vez realizada la importación, no es posible revertir el proceso. Asegúrate de que cuentas con una copia de seguridad de la base de datos.</p>
							<button type="button" className="box main-button menu-item" onClick={() => this.saveSubjects(professors)}>
						Importar Profesores
							</button>
						</Modal>
					</>
				)
					: <h2 className="centered">No hay nuevos profesores disponibles para {degree.acronym}</h2>}

			</>
		);
	}
}
