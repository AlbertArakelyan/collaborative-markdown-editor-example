// src/components/CreateDocument.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateDocument = () => {
  const navigate = useNavigate();

  const createNewDocument = async () => {
    const response = await fetch('http://localhost:4000/documents', {
      method: 'POST',
    });
    const data = await response.json();
    navigate(`/document/${data.documentId}`);
  };

  return (
    <div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={createNewDocument}>Create New Document</button>
    </div>
  );
};

export default CreateDocument;
