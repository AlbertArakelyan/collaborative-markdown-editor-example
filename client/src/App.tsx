import { Routes, Route } from 'react-router-dom';

import Editor from './components/Editor';
import CreateDocument from './components/CreateDocument';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/document/:documentId" element={<Editor />} />
        <Route path="/document/create" element={<CreateDocument />} />
      </Routes>
    </div>
  );
}

export default App;
