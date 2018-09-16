import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main>
    <h2>Page not found</h2>

    <Link to="/">Go home</Link>
  </main>
);

export default NotFound;
