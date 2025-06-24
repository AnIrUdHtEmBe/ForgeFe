import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import E_Routes from './types/routes';
import Outlay from './views/Outlay/Outlay';
// import Login from './views/Login/Login';
import { SnackbarProvider } from 'notistack';
import BookSport from './views/BookSport/BookSport';
import ViewCards from './views/ViewCards/ViewCards';
import BookFitness from './views/BookFitness/BookFitness';
import BookWellness from './views/BookWellness/BookWellness';
import DetailView from './views/BookWellness/components/DetailView';
import ViewPlan from './views/ViewPlan/ViewPlan';
import GameDetails from './components/GameDetails/GameDetails';
// import Register from './views/Register/Register';
import LandingPage from './views/LandingPage/LandingPage';
import Login from './components/Login/Login';

function App() {
	return (
		<SnackbarProvider>
			<BrowserRouter>
				<Routes>
					<Route 
						path={E_Routes.viewPlan} 
						element={<ViewPlan />}
					/>
					<Route                                                                                                                                  
						path={E_Routes.home}
						element={<Outlay children={<LandingPage></LandingPage>} />}
					/>
					<Route
						path={E_Routes.login}
						element={<Login />}
					/>

					<Route
						path={E_Routes.bookSport}
						element={<Outlay children={<BookSport />} />}
					/>

					<Route
						path={E_Routes.viewCards}
						element={<Outlay children={<ViewCards />} />}
					/>
					<Route
						path={E_Routes.bookFitness}
						element={<Outlay children={<BookFitness />} />}
					/>
					<Route
						path={E_Routes.bookWellness}
						element={<Outlay children={<BookWellness />} />}
					/>
					<Route
						path={E_Routes.detailedViewWellness}
						element={<Outlay children={<DetailView />} />}
					/>
					<Route
						path={E_Routes.gameDetails}
						element={<Outlay children={<GameDetails></GameDetails>} />}
					/>
				</Routes>
			</BrowserRouter>
		</SnackbarProvider>
	);
}

export default App;
