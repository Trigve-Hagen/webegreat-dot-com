import React from 'react';
import Navigation from './components/navigation';

const App = ({ children }) => (
    <div>
      <Navigation />
      {children}
    </div>
);

export default App;
