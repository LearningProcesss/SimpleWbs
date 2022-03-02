import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import ClientDashboard from './components/ClientDashboard';
import { useAuthContext } from './hooks/authcontext';
import { Routes, Router, Route, Link, useNavigate } from "react-router-dom";

function App() {

  const { isLoggedIn } = useAuthContext();

  console.log("App-isLoggedIn-", isLoggedIn);

  if (isLoggedIn !== true) {
    return <Login />
  }

  return <Routes>
    <Route path="/" element={<Home />}>
      <Route path="/clients" element={<ClientDashboard />} />

    </Route>
  </Routes>
}

export default App;
