import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ErrorView from './views/ErrorView';
import InitialMenu from './views/InitialMenu';
import LoginErrorView from './views/LoginErrorView';
import ProfessorList from './views/ProfessorList';
import ProfessorProfile from './views/ProfessorProfile';
import RankingView from './views/RankingView';
import AdminMainView from './views/admin/AdminMainView';
import AdminDegreesView from './views/admin/AdminDegreesView';
import SubjectDetails from './views/SubjectDetails';
import SubjectList from './views/SubjectList';
import AdminSubjectsList from './views/admin/AdminSubjectsList';

export default function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={InitialMenu} />
				<Route exact path="/asignaturas" component={SubjectList} />
				<Route path="/asignaturas/:subjAcr" component={SubjectDetails} />
				<Route exact path="/profesores" component={ProfessorList} />
				<Route path="/profesores/:profId" component={ProfessorProfile} />
				<Route path="/ranking" component={RankingView} />


				<Route exact path="/admin" component={AdminMainView} />
				<Route exact path="/admin/degrees" component={AdminDegreesView} />

				<Route exact path="/admin/update/subjects" component={() => <AdminDegreesView subjects />} />
				<Route exact path="/admin/update/subjects/:degreeId" component={AdminSubjectsList} />

				<Route exact path="/admin/subjects" component={() => <AdminDegreesView updateSubjects />} />
				{/* <Route path="/admin/subjects/:degreeId" component={AdminDegreesList} /> */}

				<Route exact path="/admin/update/professors" component={() => <AdminDegreesView updateProfessors />} />
				<Route exact path="/admin/update/professors/:degreeId" component={AdminSubjectsList} />

				<Route exact path="/admin/professors" component={() => <AdminDegreesView professors />} />
				{/* <Route path="/admin/professors/:degreeId" component={AdminDegreesList} /> */}

				<Route path="/failed-login" component={LoginErrorView} />
				<Route path="/500" render={props => <ErrorView {...props} code={500} />} />
				<Route render={props => <ErrorView {...props} code={404} />} />
			</Switch>
		</BrowserRouter>
	);
}
