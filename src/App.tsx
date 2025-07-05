import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';

import Today from './pages/Today';
import Routines from './pages/Routines';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} /> {/* Redirección automática */}
          <Route path="/today" element={<Today />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirección para rutas no válidas */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;