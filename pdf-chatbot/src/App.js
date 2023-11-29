import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [pdfs, setPdfs] = useState([]);
    const [userContext, setUserContext] = useState('');
    const [chatbotResponse, setChatbotResponse] = useState('');

    const handleFileChange = (event) => {
        setPdfs(event.target.files);
    };

    const handleContextChange = (event) => {
        setUserContext(event.target.value);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('context', userContext);
            for (let i = 0; i < pdfs.length; i++) {
                formData.append('pdfs', pdfs[i]);
            }

            const response = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setChatbotResponse(response.data.response);
        } catch (error) {
            console.error('Error uploading PDFs:', error);
        }
    };

    return (
        <div>
            <div>
                <textarea placeholder="Enter context for the conversation" onChange={handleContextChange}></textarea>
                <input type="file" multiple onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div>
                <p>Chatbot Response: {chatbotResponse}</p>
            </div>
        </div>
    );
}

export default App;