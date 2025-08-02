import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { IssuesProvider } from './context/IssuesContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssueDetailPage from './pages/IssueDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <LocationProvider>
        <IssuesProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/report" element={<ReportIssuePage />} />
                <Route path="/issue/:id" element={<IssueDetailPage />} />
              </Routes>
            </main>
          </div>
        </IssuesProvider>
      </LocationProvider>
    </Router>
  );
}

export default App; 