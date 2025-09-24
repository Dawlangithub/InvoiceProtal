import { useEffect, useRef, useState } from "react";
import { SendOutlined, RobotOutlined, UserOutlined, AudioOutlined, AudioMutedOutlined, SoundOutlined, SoundFilled, ClearOutlined } from "@ant-design/icons";
import { Input, Button, Avatar, Card, Typography, message, Tooltip } from "antd";
import BAScreenWrapper from "./BAScreenWrapper";
import { customDecrypt } from "../config/helpers";
import { useNavigate } from "react-router";

const { Text } = Typography;

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hello! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [loggedInUser, setLoggedInUser] = useState<any>({});
    const [isStreaming, setIsStreaming] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const navigate = useNavigate();
    
    // Voice-related state
    const [isListening, setIsListening] = useState(false);
    const [isAutoSpeak, setIsAutoSpeak] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const recognitionRef = useRef<any>(null);
    const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setSpeechSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onstart = () => {
                setIsListening(true);
                message.info('Listening... Speak now');
            };
            
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };
            
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                message.error('Voice recognition error. Please try again.');
            };
            
            recognition.onend = () => {
                setIsListening(false);
            };
            
            recognitionRef.current = recognition;
        } else {
            setSpeechSupported(false);
        }
    }, []);

    // Speech synthesis function
    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            // Try to use a more natural voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Natural') ||
                voice.name.includes('Enhanced')
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            speechSynthRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Start voice recognition
    const startListening = () => {
        if (recognitionRef.current && speechSupported && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                message.error('Could not start voice recognition');
            }
        }
    };

    // Stop voice recognition
    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    // Toggle auto-speak
    const toggleAutoSpeak = () => {
        setIsAutoSpeak(!isAutoSpeak);
        if (!isAutoSpeak) {
            message.success('Auto-speak enabled');
        } else {
            message.success('Auto-speak disabled');
            window.speechSynthesis.cancel(); // Stop any ongoing speech
        }
    };

    // Clear thread and start new conversation
    const startNewConversation = () => {
        localStorage.removeItem(`chatbot_thread_${loggedInUser.clientId}`);
        setMessages([{ from: "bot", text: "Hello! How can I help you today?" }]);
        message.success('New conversation started');
    };

    const handleSend = async () => {
        try {
            if (!input.trim() || isStreaming) return;

            const userMessage = input;
            setInput(""); // Clear input immediately
            setMessages(prev => [...prev, { from: "user", text: userMessage }]);
            setIsStreaming(true);

            // Close any existing EventSource
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            // Get or create threadId from localStorage
            let threadId = localStorage.getItem(`chatbot_thread_${loggedInUser.clientId}`);
            if (!threadId) {
                threadId = `${loggedInUser.clientId}-${new Date().toISOString()}-${new Date().getTime()}`;
                localStorage.setItem(`chatbot_thread_${loggedInUser.clientId}`, threadId);
            }
            
            const data = {
                client: loggedInUser.clientId,
                token: localStorage.getItem("FBR_APP_TOKEN"),
                thread_id: threadId,
                url: "https://einvoiceapi.finosys.com",
                message: userMessage
            };

            console.log("Sending data to chatbot:", data);

            // First, send the POST request to initiate the chat
            const response = await fetch('https://ebot.finosys.com/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if response is streaming
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('text/event-stream')) {
                // Handle streaming response
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let botResponse = '';
                
                // Add empty bot message that will be updated
                setMessages(prev => [...prev, { from: "bot", text: "" }]);
                
                if (reader) {
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            
                            const chunk = decoder.decode(value);
                            const lines = chunk.split('\n');
                            
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    const data = line.slice(6);
                                    if (data === '[DONE]') {
                                        setIsStreaming(false);
                                        return;
                                    }
                                    
                                    try {
                                        const parsed = JSON.parse(data);
                                        if (parsed.content) {
                                            botResponse += parsed.content;
                                            
                                            // Update the bot message in real-time
                                            setMessages(prev => {
                                                const newMessages = [...prev];
                                                const lastMessage = newMessages[newMessages.length - 1];
                                                if (lastMessage && lastMessage.from === 'bot') {
                                                    lastMessage.text = botResponse;
                                                }
                                                return newMessages;
                                            });
                                        }
                                    } catch (e) {
                                        // If not JSON, treat as plain text
                                        botResponse += data;
                                        setMessages(prev => {
                                            const newMessages = [...prev];
                                            const lastMessage = newMessages[newMessages.length - 1];
                                            if (lastMessage && lastMessage.from === 'bot') {
                                                lastMessage.text = botResponse;
                                            }
                                            return newMessages;
                                        });
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Stream reading error:', error);
                        setMessages(prev => {
                            const newMessages = [...prev];
                            const lastMessage = newMessages[newMessages.length - 1];
                            if (lastMessage && lastMessage.from === 'bot') {
                                lastMessage.text = "Sorry, there was an error processing your request.";
                            }
                            return newMessages;
                        });
                    } finally {
                        setIsStreaming(false);
                    }
                }
            } else {
                // Handle regular JSON response
                const jsonResponse = await response.json();
                console.log("Chatbot response:", jsonResponse);
                setMessages(prev => [
                    ...prev,
                    { from: "bot", text: jsonResponse.response || "I'm not sure how to respond to that." }
                ]);
                setIsStreaming(false);
                
                // Auto-speak the response if enabled
                if (isAutoSpeak && jsonResponse.response) {
                    speakText(jsonResponse.response);
                }
            }

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                { from: "bot", text: "An error occurred while sending your message." }
            ]);
            setIsStreaming(false);
        }
    };

    // Scroll to bottom on new message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        let user: any = localStorage.getItem("FBR_APP_USER")
        user = JSON.parse(customDecrypt(user) || "{}")
        if (user) {
            if (user.userType === "client" && !user.clientId) {
                navigate("/company-registration", { replace: true })
            } else {
                setLoggedInUser({ ...user })
            }
        } else {
            navigate("/login", { replace: true })
        }
    }, [])

    // Cleanup EventSource on unmount
    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            // Stop any ongoing speech
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Ctrl + M or Cmd + M to toggle microphone
            if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
                event.preventDefault();
                if (isListening) {
                    stopListening();
                } else {
                    startListening();
                }
            }
            // Ctrl + Shift + S or Cmd + Shift + S to toggle auto-speak
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
                event.preventDefault();
                toggleAutoSpeak();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isListening, isAutoSpeak]);

    return (
        <BAScreenWrapper title={"Chatbot"}>
            <Card
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 5,
                }}
                bodyStyle={{
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
                title={
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>
                            <RobotOutlined style={{ marginRight: 8 }} />
                            Chatbot {isStreaming && <span style={{ fontSize: 12 }}>• Typing...</span>}
                        </span>
                        <div style={{ display: "flex", gap: 8 }}>
                            <Tooltip title="Start New Conversation">
                                <Button
                                    type="text"
                                    icon={<ClearOutlined />}
                                    onClick={startNewConversation}
                                    disabled={isStreaming}
                                    style={{ color: '#fff' }}
                                />
                            </Tooltip>
                            {speechSupported && (
                                <Tooltip title={`Voice Input ${isListening ? '(Listening...)' : '(Ctrl+M)'}`}>
                                    <Button
                                        type="text"
                                        icon={isListening ? <AudioOutlined style={{ color: '#ff4d4f' }} /> : <AudioMutedOutlined />}
                                        onClick={isListening ? stopListening : startListening}
                                        disabled={isStreaming}
                                        style={{ color: '#fff' }}
                                    />
                                </Tooltip>
                            )}
                            <Tooltip title={`Auto-speak ${isAutoSpeak ? 'ON' : 'OFF'} (Ctrl+Shift+S)`}>
                                <Button
                                    type="text"
                                    icon={isAutoSpeak ? <SoundFilled style={{ color: '#52c41a' }} /> : <SoundOutlined />}
                                    onClick={toggleAutoSpeak}
                                    style={{ color: '#fff' }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                }
                headStyle={{
                    background: "#13999e",
                    color: "#fff",
                    fontSize: 18,
                }}
            >
                <div
                    style={{
                        overflowY: "auto",
                        padding: 16,
                        background: "#f9f9f9",
                        height: "calc(100vh - 260px)",
                    }}
                >
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                flexDirection: msg.from === "user" ? "row-reverse" : "row",
                                alignItems: "flex-end",
                                marginBottom: 12,
                            }}
                        >
                            <Avatar
                                icon={msg.from === "bot" ? <RobotOutlined /> : <UserOutlined />}
                                style={{
                                    background: msg.from === "bot" ? "#13999e" : "#1890ff",
                                    marginLeft: msg.from === "user" ? 8 : 0,
                                    marginRight: msg.from === "bot" ? 8 : 0,
                                }}
                            />
                            <div
                                style={{
                                    background: msg.from === "bot" ? "#e6f7fa" : "#ffffff",
                                    color: "#333",
                                    borderRadius: 16,
                                    padding: "8px 16px",
                                    maxWidth: "70%",
                                    wordBreak: "break-word",
                                    position: "relative",
                                }}
                            >
                                <Text>{msg.text}</Text>
                                {msg.from === "bot" && msg.text && (
                                    <Button
                                        type="text"
                                        icon={<SoundOutlined />}
                                        size="small"
                                        onClick={() => speakText(msg.text)}
                                        style={{
                                            position: "absolute",
                                            top: 4,
                                            right: 4,
                                            minWidth: 20,
                                            height: 20,
                                            fontSize: 10,
                                            opacity: 0.7,
                                        }}
                                        title="Read aloud"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div style={{ padding: 16, borderTop: "1px solid #eee", background: "#fff", borderRadius: "0 0 16px 16px" }}>
                    <Input
                        placeholder={isListening ? "Listening..." : "Type your message or use voice input..."}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onPressEnter={handleSend}
                        autoFocus
                        disabled={isStreaming || isListening}
                        suffix={
                            <div style={{ display: "flex", gap: 4 }}>
                                {speechSupported && (
                                    <Tooltip title={isListening ? "Stop listening" : "Start voice input"}>
                                        <Button
                                            type={isListening ? "primary" : "default"}
                                            icon={isListening ? <AudioOutlined /> : <AudioMutedOutlined />}
                                            onClick={isListening ? stopListening : startListening}
                                            disabled={isStreaming}
                                            danger={isListening}
                                            size="small"
                                        />
                                    </Tooltip>
                                )}
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isStreaming || isListening}
                                    loading={isStreaming}
                                />
                            </div>
                        }
                    />
                    {speechSupported && (
                        <div style={{ marginTop: 8, fontSize: 12, color: "#666", textAlign: "center" }}>
                            Keyboard shortcuts: Ctrl+M (voice input) • Ctrl+Shift+S (toggle auto-speak)
                        </div>
                    )}
                </div>
            </Card>
        </BAScreenWrapper>
    );
}