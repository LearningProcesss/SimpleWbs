import { Route, Routes } from "react-router-dom";
import './App.css';
import ClientDashboard from './components/ClientDashboard';
import ClientDetail from './components/ClientDetail';
import ProjectDetail from './components/ProjectDetail';
import Home from './components/Home';
import Login from './components/Login';
import { useAuthContext } from './hooks/authcontext';

function App() {

  const { userInfo } = useAuthContext();

  console.log("App-userInfo", userInfo);

  if (userInfo.isLoggedIn !== true) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Login />
    </div>
  }

  return <Routes>
    <Route path="/" element={<Home />}>
      <Route path="/clients" element={<ClientDashboard />} />
      <Route path="/clients/:clientId" element={<ClientDetail />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
    </Route>
  </Routes>
}

export default App;
