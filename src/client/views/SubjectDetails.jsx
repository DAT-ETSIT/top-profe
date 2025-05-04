import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { fetchGet, fetchPost } from '../util';
import ProfessorRow from './subcomponents/ProfessorRow';
import toast, { LoaderIcon, CheckmarkIcon } from 'react-hot-toast';

function SubjectDetails(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class SubjectDetailsClass extends Component {
	constructor(props) {
		super(props);
		const { params: { subjId } } = this.props;
		this.subjId = subjId;

		this.state = {
			isLoaded: false,
			subject: {},
			ballots: {},
			user: {},
		};

		this.submitRating = this.submitRating.bind(this);
	}

	componentDidMount() {
		this.loadSubjectData();
	}

	loadSubjectData() {
		fetchGet('/api/user')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					user: res,
				});
			});

		fetchGet(`/api/subjects/${this.subjId}`)
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subject: res.subject,
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
			isLoaded, subject, ballots, user,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const professorRows = [];
		ballots.forEach((ballot) => {
			const { professor } = ballot;
			const row = (
				<ProfessorRow
					key={ballot.id}
					ballotId={ballot.id}
					profStatus={professor.status}
					profHash={professor.hash}
					profName={professor.name}
					profAvg={ballot.avg}
					profCount={ballot.count}
					userIsStudent={user.type === 'student'}
					userIsAdmin={user.admin}
					subjectDegree={subject.degreeId}
					studentDegree={user.degreeId}
					voteExists={ballot.register.length > 0}
					onVote={this.submitRating}
				/>
			);
			professorRows.push(row);
		});

		return (
			<div>
				<h2 className="centered">{subject.name} ({subject.degree.acronym})</h2>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Profesor</th>
							<th>Media (en {subject.acronym || subject.id})</th>
							<th className="star-column">Votar</th>
						</tr>
					</thead>
					<tbody>
						{professorRows}
					</tbody>
				</table>
				<a className="back-link" href="/subjects">
					<FontAwesomeIcon className="back-icon" icon={faArrowLeft} />Volver al listado de asignaturas
				</a>
			</div>
		);
	}
}

export default SubjectDetails(SubjectDetailsClass);
