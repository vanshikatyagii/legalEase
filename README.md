# ⚖️ LegalEase — AI-Powered Legal Document Analyzer

LegalEase is a full-stack AI-powered platform that simplifies legal document understanding. Upload contracts, agreements, NDAs, and more — and let LegalEase extract key insights like summaries and named entities using NLP and OCR.

## 🌟 Features

- 🔐 **Secure Auth System**
  - Manual login/signup with role-based access (`user` / `admin`)
  - Google OAuth support with Firebase
- 📄 **Smart PDF Analysis**
  - OCR-powered PDF text extraction using `pytesseract`
  - Text summarization using HuggingFace `distilbart-cnn`
  - Named Entity Recognition via spaCy
- 📊 **Admin Dashboard**
  - Total document analytics
  - Graphs for named entities and label distribution
  - Full document inspection table
  - Light/Dark mode support
- 🧑‍💼 **User Dashboard**
  - Upload and analyze documents instantly
  - Animated chat-like assistant UI
  - View summaries and entities with ease

## 🧰 Tech Stack

| Layer         | Tools Used                                      |
| ------------- | ----------------------------------------------- |
| **Frontend**  | ReactJS, Bootstrap, Chart.js, Firebase Auth     |
| **Backend**   | Node.js + Express (Auth), Flask (NLP & OCR)     |
| **Database**  | MongoDB Atlas (Mongoose for Node)               |
| **AI Models** | `distilbart-cnn` (summarization), spaCy NER     |
| **OCR**       | `pytesseract` + `pdf2image`                     |


