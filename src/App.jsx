import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import CreateQuotation from './pages/CreateQuotation';
import QuotationHistory from './pages/QuotationHistory';
import Settings from './pages/Settings';
import Preview from './pages/Preview';
import CreateChallan from './pages/CreateChallan';
import PreviewChallan from './pages/PreviewChallan';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateQuotation />} />
            <Route path="/edit/:id" element={<CreateQuotation />} />
            <Route path="/history" element={<QuotationHistory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/preview/:id" element={<Preview />} />
            <Route path="/create-challan" element={<CreateChallan />} />
            <Route path="/edit-challan/:id" element={<CreateChallan />} />
            <Route path="/preview-challan/:id" element={<PreviewChallan />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
