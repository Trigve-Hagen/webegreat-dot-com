import React from 'react';
import ErrorBoundary from '../src/components/error-boundry';

const App = ({ children }) => (
    <div>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
);

export default App;
