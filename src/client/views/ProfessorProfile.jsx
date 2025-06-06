import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SubjectRow from './subcomponents/SubjectRow';
import { fetchGet, fetchPost } from '../util';
import toast, { LoaderIcon, CheckmarkIcon } from 'react-hot-toast';

function ProfessorProfile(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class ProfessorProfileClass extends Component {
	constructor(props) {
		super(props);
		const { params: { profId } } = this.props;
		this.profId = profId;

		this.state = {
			isLoaded: false,
			professor: {},
			ballots: {},
			user: {},
		};

		this.submitRating = this.submitRating.bind(this);
	}

	componentDidMount() {
		this.loadProfessorData();
	}

	loadProfessorData() {
		fetchGet('/api/user')
			.then(r => (r?.status ===200) && r.json())
			.then((res) => {
				this.setState({
					user: res,
				});
			});

		fetchGet(`/api/professors/${this.profId}`)
			.then(r => (r?.status ===200) && r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					professor: res.professor,
					ballots: res.ballots,
				});
			});
	}

	submitRating(ballotId, stars) {
		fetchPost(`/api/verified/ballots/${ballotId}`, { stars })
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				toast(t => (
					<span className='custom-toast'>
						<span>Voto enviado.</span>
						<button type="button" className="box main-button toast-button menu-item" onClick={() => window.open(res.voteURL, '_blank')}>Ver (sólo esta vez)</button>
					</span>
				),
				{
					icon: <CheckmarkIcon />,
				});
				// Load again the professor's profile to reflect the new data.
				this.loadProfessorData();
			});
	}

	render() {
		const {
			isLoaded, professor, ballots, user,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const subjectRows = [];
		ballots.forEach((ballot) => {
			const { subject } = ballot;
			const row = (
				<SubjectRow
					key={ballot.id}
					ballotId={ballot.id}
					profId={professor.id}
					profStatus={professor.status}
					userIsStudent={user.type === 'student'}
					userIsAdmin={user.admin}
					subjectDegree={subject.degreeId}
					studentDegree={user.degreeId}
					subjectId={subject.id}
					subjectAcronym={subject.acronym}
					subjectName={subject.name}
					subjectAvg={ballot.avg}
					subjectCount={ballot.count}
					degreeAcronym={subject.degree.acronym}
					voteExists={ballot.register.length > 0}
					onVote={this.submitRating}
				/>
			);
			subjectRows.push(row);
		});

		return (
			<div>
				<h2 className="centered">{professor.name}</h2>
				{professor.status === 'excluded' && <i className="centered excluded">Este profesor no desea que sus valoraciones sean públicas.</i>}
				<table className="full-width box">
					<thead>
						<tr>
							<th>Asignatura</th>
							<th>Media</th>
							<th className="star-column">Votar</th>
						</tr>
					</thead>
					<tbody>
						{ subjectRows }
					</tbody>
				</table>
				<a className="back-link" href="/professors">
					<FontAwesomeIcon className="back-icon" icon={faArrowLeft} />Volver al listado de profesores
				</a>
			</div>
		);
	}
}

export default ProfessorProfile(ProfessorProfileClass);
