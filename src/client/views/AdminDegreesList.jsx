import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { fetchGet } from '../util';

export default class AdminDegreesList extends Component {
	constructor() {
		super();

		this.state = {
			isLoaded: false,
			degrees: {},
			searchKeyword: '',
		};

		this.searchUpdated = this.searchUpdated.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/admin/degrees')
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					degrees: res,
				});
			});
	}

	searchUpdated(searchKeyword) {
		this.setState({
			// Remove accents from the search keywords.
			searchKeyword: searchKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
		});
	}

	render() {
		const { isLoaded, degrees, searchKeyword } = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const filteredDegrees = degrees.filter(createFilter(
			searchKeyword, ['name', 'acronym', 'id'],
		));

		return (
			<div>
				<h2 className="centered">Titulaciones</h2>
				<SearchInput
					className="big-input search-input box"
					placeholder="Buscar titulación..."
					throttle={0}
					onChange={this.searchUpdated}
				/>
				<br />
				<p className="">
					Aquí se muestra un listado de todas las titulaciones disponibles.
				</p>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Código</th>
						</tr>
					</thead>
					<tbody>
						{ filteredDegrees.map(degree => (
							<tr key={degree.id}>
								<td>
									<a href={`/admin/degrees/${degree.id}`}>
										{degree.name} ({degree.acronym})
									</a>
								</td>
								<td>
									<a href={`/admin/degrees/${degree.id}`}>
										{degree.id}
									</a>
								</td>
							</tr>
						)) }
					</tbody>
				</table>
			</div>
		);
	}
}
