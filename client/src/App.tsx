import { Routes, Route, Navigate } from 'react-router-dom';

import Editor from './pages/Editor';
import CreateDocument from './pages/CreateDocument';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/document/:documentId" element={<Editor />} />
        <Route path="/document/create" element={<CreateDocument />} />
        <Route path="*" element={<Navigate to="/document/create" />} />
      </Routes>
    </div>
  );
}

export default App;
