import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import E_Routes from "./types/routes";
import Outlay from "./views/Outlay/Outlay";
// import Login from './views/Login/Login';
import { SnackbarProvider } from "notistack";
import BookSport from "./views/BookSport/BookSport";
import ViewCards from "./views/ViewCards/ViewCards";
import BookFitness from "./views/BookFitness/BookFitness";
import BookWellness from "./views/BookWellness/BookWellness";
import DetailView from "./views/BookWellness/components/DetailView";
import ViewPlan from "./views/ViewPlan/ViewPlan";
import GameDetails from "./components/GameDetails/GameDetails";
// import Register from './views/Register/Register';
import LandingPage from "./views/LandingPage/LandingPage";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/ProtectectedRoute/PrivateRoute";
import PasswordReset from "./views/PasswordReset/PasswordReset";

function App() {
  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={E_Routes.home}
            element={<Outlay children={<LandingPage></LandingPage>} />}
          />
          {/* <Route
						path={E_Routes.login}
						element={<Login />}
						/> */}

          <Route
            path={E_Routes.passwordReset}
            element={<Outlay children={<PasswordReset />} />}
          />

          <Route
            path={E_Routes.viewPlan}
            element={
              <PrivateRoute>
                <Outlay children={<ViewPlan />} />
              </PrivateRoute>
            }
          />
          <Route
            path={E_Routes.bookSport}
            element={
              <PrivateRoute>
                <Outlay children={<BookSport />} />
              </PrivateRoute>
            }
          />
          <Route
            path={E_Routes.viewCards}
            element={
              <PrivateRoute>
                <Outlay children={<ViewCards />} />
              </PrivateRoute>
            }
          />
          <Route
            path={E_Routes.bookFitness}
            element={
              <PrivateRoute>
                <Outlay children={<BookFitness />} />
              </PrivateRoute>
            }
          />
          <Route
            path={E_Routes.bookWellness}
            element={
              <PrivateRoute>
                <Outlay children={<BookWellness />} />
              </PrivateRoute>
            }
          />
          <Route
            path={E_Routes.detailedViewWellness}
            element={
              <PrivateRoute>
                <Outlay children={<DetailView />} />
              </PrivateRoute>
            }
          />
          <Route
            path={E_Routes.gameDetails}
            element={
              <PrivateRoute>
                <Outlay children={<GameDetails />} />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
