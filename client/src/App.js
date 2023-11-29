import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';


function App() {
    const [userInput, setUserInput] = useState('');
    const [serviceRequest, setServiceRequest] = useState('');
    const [chat, setChat] = useState([]);
  const [userChat, setUserChat] = useState([]);
    const [openAIChat, setOpenAIChat] = useState([]);
 const [openAIInput, setOpenAIInput] = useState('');
const [pdfInput, setPdfInput] = useState('');
 const [files, setFiles] = useState([]);

    const sendMessage = async () => {
        if (userInput.trim() === '') return;

        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInput }),
            });

            if (response.ok) {
                const data = await response.json();
                setChat([...chat, { user: data.user }, { ai: data.ai }]);
                setUserInput('');
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
 const sendOpenAIMessage = async () => {
        if (openAIInput.trim() === '') return;

        try {
            // Send user message to OpenAI
            const openaiResponse = await fetch('http://localhost:3001/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: openAIInput }),
            });

            if (openaiResponse.ok) {
                const openaiData = await openaiResponse.json();
                setOpenAIChat([...openAIChat, { ai: openaiData.ai }]);

                // Clear OpenAI input
                setOpenAIInput('');
            } else {
                console.error('OpenAI API Error:', openaiResponse.statusText);
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
        }
    };
const sendPdfMessage = async () => {
        if (pdfInput.trim() === '') return;

        try {
            // Send base64-encoded PDF to the server
            const pdfResponse = await fetch('http://localhost:3001/api/processpdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pdf: pdfInput }),
            });

            if (pdfResponse.ok) {
                setUserChat([...userChat, { user: 'PDF file processed successfully.' }]);
            } else {
                console.error('PDF Processing Error:', pdfResponse.statusText);
            }

            setPdfInput('');
        } catch (error) {
            console.error('Error:', error);
        }
    };
  async function getOpenAIResponse(userMessage) {
        try {
            const openaiResponse = await fetch('http://localhost:3001/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (openaiResponse.ok) {
                const openaiData = await openaiResponse.json();
                return openaiData.ai;
            } else {
                console.error('OpenAI API Error:', openaiResponse.statusText);
                return 'Error: Unable to get AI response';
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return 'Error: Unable to get AI response';
        }
    }

    return (
       
<div className="App">
      <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">IT Service Request Form</h5>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="serviceRequest">Service Request:</label>
                                    <textarea
                                        className="form-control"
                                        id="serviceRequest"
                                        rows="3"
                                        value={serviceRequest}
                                        onChange={(e) => setServiceRequest(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="button" className="btn btn-success" onClick={sendMessage}>
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Chatbot</h5>
                            <div className="chat-box">
                                {chat.map((message, index) => (
                                    <div key={index} className={`message ${Object.keys(message)[0]}`}>
                                        <strong>{Object.keys(message)[0]}:</strong> {message[Object.keys(message)[0]]}
                                    </div>
                                ))}
                            </div>
                            <div className="input-group mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Type your message..."
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-success" type="button" onClick={sendMessage}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">OpenAI Chat</h5>
                            <div className="chat-box">
                                {openAIChat.map((message, index) => (
                                    <div key={index} className={`message ${Object.keys(message)[0]}`}>
                                        <strong>{Object.keys(message)[0]}:</strong> {message[Object.keys(message)[0]]}
                                    </div>
                                ))}
                            </div>
                            <div className="input-group mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={openAIInput}
                                    onChange={(e) => setOpenAIInput(e.target.value)}
                                    placeholder="Type your message to OpenAI..."
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-success" type="button" onClick={sendOpenAIMessage}>
                                        Send to OpenAI
                                    </button>
                                </div>
                            </div>
                        </div>
                    <div className="card mt-4">
                        <div className="card-body">
                            <h5 className="card-title">PDF Chat</h5>
                            <div className="chat-box">
                                {userChat.map((message, index) => (
                                    <div key={index} className={`message ${Object.keys(message)[0]}`}>
                                        <strong>{Object.keys(message)[0]}:</strong> {message[Object.keys(message)[0]]}
                                    </div>
                                ))}
                            </div>
                            <div className="input-group mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={pdfInput}
                                    onChange={(e) => setPdfInput(e.target.value)}
                                    placeholder="Type your PDF message..."
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-success" type="button" onClick={sendPdfMessage}>
                                        Send PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</div>
        </div>
    );
}

export default App;
