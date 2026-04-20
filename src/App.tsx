import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Room>
            <MainApp />
          </Room>
        </main>
      </div>
    </Router>
  );
};

export default App;
