/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import toast, { LoaderIcon, CheckmarkIcon } from 'react-hot-toast';

export default function SubjectRow(props) {
	const {
		ballotId,
		voteExists,
		subjectId,
		subjectAcronym,
		subjectName,
		subjectAvg,
		subjectCount,
		profStatus,
		onVote,
		userIsStudent,
		userIsAdmin,
		subjectDegree,
		studentDegree,
	} = props;

	const [voteLoaded, setVoteLoaded] = useState(true);

	useEffect(() => {
		setVoteLoaded(true);
	}, [voteExists]);

	const sendVote = ((rating) => {
		let cancelVote = false;
		toast(t => (
			<span>
				<span>Emitiendo voto...</span>
				<button type="button" className="box main-button toast-button menu-item" onClick={() => { cancelVote = true; toast.success('Voto cancelado', { id: t.id, icon: <CheckmarkIcon /> }); }}>Cancelar</button>
			</span>
		),
		{
			icon: <LoaderIcon />,
			duration: 4000,
		});
		setTimeout(() => {
			if (!cancelVote) onVote(ballotId, rating);
			else setVoteLoaded(true);
		}, 4000);
	});

	return (
		<tr>
			<td>
				<a href={`/subjects/${subjectId}`}>
					{subjectName} ({subjectAcronym || subjectId})
				</a>
			</td>
			<td className={profStatus}>
				{(!userIsAdmin && profStatus === 'excluded') ? 'OCULTO' : subjectAvg
					? `${subjectAvg.toFixed(2)}/5 (total: ${subjectCount})`
					: 'Sin datos'
				}
			</td>
			<td>
				{(userIsStudent && subjectDegree === studentDegree) ? (!voteLoaded ? 'Cargando...' : voteExists ? 'Voto emitido' : (
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						initialRating={voteExists}
						onClick={(rating) => { setVoteLoaded(false); sendVote(rating); }}
					/>
				)) : 'Bloqueado'}
			</td>
		</tr>
	);
}
