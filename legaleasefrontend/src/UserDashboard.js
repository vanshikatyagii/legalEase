import React, { useState, useEffect, useRef } from 'react';
import './UserDashboard.css';
import {
  FaBars, FaUserCircle, FaUpload, FaPaperPlane,
  FaFilePdf, FaTimesCircle, FaPlusSquare, FaRobot
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './pdfworker.js'; // ✅ Import the global worker config
import { getDocument } from 'pdfjs-dist/build/pdf';


const UserDashboard = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [customText, setCustomText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [summary, setSummary] = useState('');
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [typedText, setTypedText] = useState('');
  const textAreaRef = useRef(null);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const message = 'Welcome to LegalEase!';
    let idx = 0;
    let currentText = '';
    const interval = setInterval(() => {
      if (idx < message.length) {
        currentText += message.charAt(idx);
        setTypedText(currentText);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [customText]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading, summary, entities]);

  useEffect(() => {
    fetch("http://localhost:5050/recent-documents")
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        localStorage.setItem("history", JSON.stringify(data));
      })
      .catch(err => console.error("❌ Failed to fetch recent documents:", err));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file');
      return;
    }

    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result;
        const loadingTask = getDocument({ data: arrayBuffer });
        const loadedPdf = await loadingTask.promise;

        let extractedText = '';
        for (let i = 1; i <= loadedPdf.numPages; i++) {
          const page = await loadedPdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(' ');
          extractedText += strings + '\n';
        }

        if (extractedText.trim().length < 20) {
          setCustomText('[PDF text not readable. Will be processed using OCR.]');
        } else {
          setCustomText(extractedText.trim());
        }

      } catch (err) {
        console.error("❌ PDF extraction failed:", err);
        setCustomText('[PDF load failed. Will be sent for OCR in backend.]');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleClearFile = () => {
    setPdfFile(null);
    setCustomText('');
  };

  const handleAnalyze = async () => {
    const text = customText.trim();
    if (!text || text.length < 50) {
      return alert("Please enter at least 50 characters of text or upload a readable PDF.");
    }

    const title = pdfFile
      ? pdfFile.name
      : text.split(" ").slice(0, 4).join(" ") + "...";

    setSubmittedText(text);
    setCustomText('');
    setLoading(true);
    setPdfFile(null);

    try {
      const response = await fetch("http://localhost:5050/analyze-and-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text })
      });

      const result = await response.json();
      setSummary(result.summary);
      setEntities(result.entities);

      const newEntry = {
        filename: title,
        timestamp: new Date().toLocaleString()
      };

      const updated = [newEntry, ...history.slice(0, 4)];
      setHistory(updated);
      localStorage.setItem("history", JSON.stringify(updated));

      if (result.summary && result.summary.includes("⚠️")) {
        setEntities([]);
        setShowRejectionModal(true);
      }

    } catch (err) {
      console.error("❌ Analysis failed:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setPdfFile(null);
    setCustomText('');
    setSubmittedText('');
    setSummary('');
    setEntities([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/logout';
  };

  return (
    <div className={`dashboard-wrapper ${lightMode ? 'light-mode' : ''}`}>
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <FaBars className="navbar-icon" onClick={() => setShowSidebar(!showSidebar)} />
          <FaPlusSquare className="navbar-new-icon" title="New Analysis" onClick={handleNewAnalysis} />
        </div>
        <div className="navbar-title">LegalEase</div>
        <div className="navbar-user-wrapper" onClick={() => setShowUserMenu(!showUserMenu)}>
          <FaUserCircle className="user-icon" />
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={() => setLightMode(!lightMode)}>
                {lightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </div>
              <div className="dropdown-item" onClick={() => navigate('/analytics')}>
                📊 View Analytics
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className={`sidebar-panel animated-sidebar ${showSidebar ? '' : 'hidden'}`}>
        <h4>Recent Activity</h4>
        <ul>
          {history.map((h, idx) => (
            <li key={idx}>{h.filename} <span>({h.timestamp})</span></li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <h2 className="typing-text">{typedText}</h2>

        <div className="message-output">
          {submittedText && <div className="message user-msg bubble">{submittedText}</div>}
          {loading && (
            <div className="message bot-msg bubble typing-indicator">
              <FaRobot className="robot-avatar blink" />
              <span className="dot" /><span className="dot" /><span className="dot" /> Analyzing...
            </div>
          )}
          {!loading && summary && (
            <div className="message bot-msg bubble">
              <strong>Summary:</strong> {summary}
            </div>
          )}
          {!loading && Array.isArray(entities) && entities.length > 0 && (
            <div className="message bot-msg bubble">
              <strong>Named Entities:</strong>
              <ul>
                {entities.map((ent, idx) => (
                  <li key={idx}><strong>{ent[0]}</strong> — <em>{ent[1]}</em></li>
                ))}
              </ul>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      <div className="chatbox-container">
        <div className="chatbox">
          <div className="chatbox-preview">
            {pdfFile && (
              <div className="pdf-preview">
                <FaFilePdf className="pdf-icon" /> {pdfFile.name}
                <FaTimesCircle className="clear-icon" onClick={handleClearFile} />
              </div>
            )}
          </div>
          <textarea
            ref={textAreaRef}
            className="chatbox-input"
            placeholder="Enter text or upload a PDF..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="chatbox-icons">
            <label className="chatbox-upload">
              <FaUpload />
              <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
            </label>
            <button className="chatbox-analyze" onClick={handleAnalyze} disabled={loading}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>

      {showRejectionModal && (
        <div className="modal-overlay" onClick={() => setShowRejectionModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>😅 Oops!</h3>
            <p>
              That didn’t look like a legal document.<br />
              Try submitting contracts, agreements, NDAs, or policy documents instead.
            </p>
            <button className="close-modal-btn" onClick={() => setShowRejectionModal(false)}>Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
