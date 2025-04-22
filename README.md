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

##Preview 
![image](https://github.com/user-attachments/assets/80a4f67d-3574-4252-a78d-49fb203b5188)

![image](https://github.com/user-attachments/assets/cdc4aa7a-26a7-43b0-a98b-de980266353e)

![image](https://github.com/user-attachments/assets/fd1bbf97-c155-448a-9ec5-c5917d263438)

![image](https://github.com/user-attachments/assets/fcb68c97-f1bb-42c2-8efb-33ceddb0e565)
![image](https://github.com/user-attachments/assets/d31b43eb-eafe-4b56-9cae-10a7bd0066b6)

![image](https://github.com/user-attachments/assets/e266bb83-7277-4f31-9039-15bbe7e62110)

![image](https://github.com/user-attachments/assets/de033d49-18c5-455f-8607-92dae40cb6e2)

![image](https://github.com/user-attachments/assets/944c11d9-6f54-4542-9707-47336d9b4e01)







