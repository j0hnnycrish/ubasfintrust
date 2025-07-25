import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBankingStore } from '@/lib/bankingStore';
import { ArrowLeft, Send, Bot, User, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  onBack: () => void;
}

export function AIChat({ onBack }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Banking Assistant. I can help you with account information, transaction history, transfer funds, and answer any banking questions. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, accounts, getTransactionsByAccountId, formatCurrency } = useBankingStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Account balance queries
    if (message.includes('balance') || message.includes('account')) {
      if (accounts.length === 0) {
        return "I don't see any accounts associated with your profile. Please contact customer service for assistance.";
      }
      
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      let response = `Here are your account balances:\n\n`;
      
      accounts.forEach(account => {
        response += `• ${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account (****${account.accountNumber.slice(-4)}): ${formatCurrency(account.balance)}\n`;
      });
      
      response += `\nTotal Balance: ${formatCurrency(totalBalance)}`;
      return response;
    }
    
    // Transaction history queries
    if (message.includes('transaction') || message.includes('history') || message.includes('recent')) {
      if (accounts.length === 0) {
        return "I don't see any accounts to show transactions for. Please contact customer service.";
      }
      
      const primaryAccount = accounts[0];
      const transactions = getTransactionsByAccountId(primaryAccount.id).slice(0, 5);
      
      if (transactions.length === 0) {
        return `No recent transactions found for your ${primaryAccount.accountType} account (****${primaryAccount.accountNumber.slice(-4)}).`;
      }
      
      let response = `Here are your 5 most recent transactions for your ${primaryAccount.accountType} account:\n\n`;
      
      transactions.forEach((txn, index) => {
        const amount = txn.toAccountId === primaryAccount.id ? 
          `+${formatCurrency(txn.amount)}` : 
          `-${formatCurrency(txn.amount)}`;
        response += `${index + 1}. ${txn.description} - ${amount} (${txn.timestamp.toLocaleDateString()})\n`;
      });
      
      return response;
    }
    
    // Transfer help
    if (message.includes('transfer') || message.includes('send money') || message.includes('payment')) {
      return "I can help you with transfers! To send money:\n\n1. Use the 'Transfer Funds' feature on your dashboard\n2. Select your source account\n3. Enter the recipient's 10-digit account number\n4. Specify the amount and description\n5. Confirm the transfer\n\nTransfers are processed instantly in our simulation. Is there anything specific about transfers you'd like to know?";
    }
    
    // Account information
    if (message.includes('account number') || message.includes('account details')) {
      if (accounts.length === 0) {
        return "I don't see any accounts associated with your profile.";
      }
      
      let response = "Here are your account details:\n\n";
      accounts.forEach(account => {
        response += `• ${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account\n`;
        response += `  Account Number: ${account.accountNumber}\n`;
        response += `  Status: ${account.isActive ? 'Active' : 'Inactive'}\n`;
        response += `  Balance: ${formatCurrency(account.balance)}\n\n`;
      });
      
      return response;
    }
    
    // General banking help
    if (message.includes('help') || message.includes('what can you do')) {
      return "I can help you with:\n\n• Check account balances\n• View transaction history\n• Guide you through transfers\n• Explain banking features\n• Answer account questions\n• Provide security tips\n\nJust ask me anything about your banking needs! For example, try asking 'What's my balance?' or 'Show my recent transactions'.";
    }
    
    // Security questions
    if (message.includes('security') || message.includes('safe') || message.includes('protect')) {
      return "Security is our top priority! Here are some tips:\n\n• Never share your login credentials\n• Always log out when finished\n• Use strong, unique passwords\n• Monitor your accounts regularly\n• Report suspicious activity immediately\n• This is a simulation - no real money is involved\n\nIs there a specific security concern I can help address?";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello ${user?.firstName}! I'm here to help with all your banking needs. You can ask me about your account balances, recent transactions, or how to use any of our banking features. What would you like to know?`;
    }
    
    // Default response
    return "I understand you're asking about banking services. I can help you with account balances, transaction history, transfers, and general banking questions. Could you please be more specific about what you'd like to know? For example, you could ask 'What's my checking account balance?' or 'Show me my recent transactions'.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = generateAIResponse(inputMessage);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What's my account balance?",
    "Show my recent transactions",
    "How do I transfer money?",
    "What are my account details?",
  ];

  return (
    <div className="min-h-screen bg-banking-bg p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="banking-outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-banking rounded-xl">
              <MessageSquare className="h-8 w-8 text-banking-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-banking-dark">AI Banking Assistant</h1>
              <p className="text-banking-gray mt-1">Get instant help with your banking needs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-card-banking bg-gradient-card border-banking-gold/20">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-banking-dark">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="banking-outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs h-auto p-3"
                    onClick={() => setInputMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="shadow-elegant bg-gradient-card border-banking-gold/20 h-[600px] flex flex-col">
              <CardHeader className="border-b border-banking-gold/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-banking-gold/10 rounded-lg">
                    <Bot className="h-5 w-5 text-banking-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-banking-dark">AI Banking Assistant</CardTitle>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-banking text-banking-dark'
                          : 'bg-white border border-banking-gold/20 text-banking-dark'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'ai' && (
                          <Bot className="h-4 w-4 text-banking-gold mt-1 flex-shrink-0" />
                        )}
                        {message.sender === 'user' && (
                          <User className="h-4 w-4 text-banking-dark mt-1 flex-shrink-0" />
                        )}
                        <div className="space-y-2">
                          <p className="whitespace-pre-line text-sm leading-relaxed">
                            {message.content}
                          </p>
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-banking-gold/20 text-banking-dark p-4 rounded-lg max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-banking-gold" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-banking-gold rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-banking-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-banking-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-banking-gold/20 p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about your banking needs..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border-banking-gold/20 focus:border-banking-gold"
                    disabled={isTyping}
                  />
                  <Button
                    variant="banking"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-banking-gray mt-2">
                  Press Enter to send • This is an AI simulation for demonstration purposes
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}