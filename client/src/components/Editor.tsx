import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CodeMirror from 'codemirror';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // or any other highlight.js theme

const Editor = () => {
  const { documentId } = useParams();

  const [socket, setSocket] = useState<any>(null);
  const [content, setContent] = useState('');
  const editorRef = useRef<any | null>(null);
  const isRemoteChange = useRef(false);

  const saveDocument = () => {
    if (socket) {
      socket.emit('save-document', content);
    }
  };

  useEffect(() => {
    const s = io('http://localhost:4000');
    setSocket(s);

    s.emit('join', documentId);

    s.on('load-document', (document: string) => {
      setContent(document);
      if (editorRef.current) {
        editorRef.current.setValue(document);
      }
    });

    s.on('receive-changes', ({ changes, senderId }: { changes: string, senderId: string }) => {
      if (editorRef.current && senderId !== s.id) {
        const cursor = editorRef.current.getCursor();
        isRemoteChange.current = true;
        editorRef.current.setValue(changes);
        editorRef.current.setCursor(cursor);
      }
    });
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      const textarea = document.getElementById('editor') as HTMLTextAreaElement;
      editorRef.current = CodeMirror.fromTextArea(textarea, {
        mode: 'markdown',
        lineNumbers: true,
      });

      editorRef.current.on('change', (instance: any) => {
        const value = instance.getValue();
        setContent(value);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket && content) {
      socket.emit('send-changes', { documentId, changes: content });
      isRemoteChange.current = false;
    }
  }, [content, socket]);
  
  return (
    <div className="editor-container">
      <textarea id="editor"></textarea>
      <div className="preview">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkHtml]} // remarkHtml is optional
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
      <button onClick={saveDocument}>Save</button>
    </div>
  );
};

export default Editor;