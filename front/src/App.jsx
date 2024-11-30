import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lista from './lista';
import Adicionar from './adicionar';
import Editar from './editar';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lista />} />
        <Route path="/adicionar" element={<Adicionar />} />
        <Route path="/editar/:id" element={<Editar />} />
      </Routes>
    </Router>
  );
};

export default App;
