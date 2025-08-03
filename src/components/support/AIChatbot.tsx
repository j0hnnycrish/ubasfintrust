import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  HelpCircle,
  CreditCard,
  DollarSign,
  Shield,
  Phone
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'action';
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm UBAS AI Assistant. I'm here to help you with your banking needs. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'quick-reply',
      actions: [
        { label: 'Account Information', action: 'account_info' },
        { label: 'Transfer Money', action: 'transfer' },
        { label: 'Report Issue', action: 'report_issue' },
        { label: 'Contact Human Agent', action: 'human_agent' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();

    // Advanced natural language processing for banking queries
    const keywords = {
      balance: ['balance', 'money', 'funds', 'amount', 'how much'],
      transfer: ['transfer', 'send', 'move', 'wire', 'payment', 'pay'],
      account: ['account', 'open', 'create', 'new', 'signup', 'register'],
      loan: ['loan', 'borrow', 'credit', 'mortgage', 'financing'],
      card: ['card', 'debit', 'credit', 'atm', 'visa', 'mastercard'],
      security: ['security', 'safe', 'protect', 'fraud', 'hack', 'secure'],
      fees: ['fee', 'cost', 'charge', 'price', 'rate', 'interest'],
      mobile: ['mobile', 'app', 'phone', 'download', 'ios', 'android'],
      branch: ['branch', 'location', 'office', 'visit', 'address'],
      hours: ['hours', 'time', 'open', 'close', 'when', 'schedule'],
      problem: ['problem', 'issue', 'error', 'trouble', 'help', 'stuck'],
      investment: ['invest', 'portfolio', 'stocks', 'bonds', 'mutual', 'etf']
    };

    // Determine intent based on keyword matching
    let intent = 'general';
    let confidence = 0;

    for (const [category, words] of Object.entries(keywords)) {
      const matches = words.filter(word => lowerMessage.includes(word)).length;
      if (matches > confidence) {
        confidence = matches;
        intent = category;
      }
    }

    // Generate contextual responses based on intent
    switch (intent) {
      case 'balance':
        return {
          id: Date.now().toString(),
          text: "I understand you're asking about your account balance. To check your current balance, you can:\n\n• Log into your online banking dashboard\n• Use our mobile app\n• Visit any ATM\n• Call our 24/7 customer service\n\nWould you like me to help you with login issues or connect you with an agent?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Login Help', action: 'login_help' },
            { label: 'Mobile App Guide', action: 'app_guide' },
            { label: 'Contact Agent', action: 'human_agent' }
          ]
        };

      case 'account':
        return {
          id: Date.now().toString(),
          text: "I'd be happy to help you open a new account! We offer several account types:\n\n• **Personal Banking** - Starting at $1,000 minimum\n• **Business Banking** - Starting at $50,000 minimum\n• **Corporate Banking** - Starting at $5M minimum\n• **Private Banking** - Starting at $10M minimum\n\nEach account type comes with unique benefits and features. Which type interests you most?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Personal Account', action: 'open_personal' },
            { label: 'Business Account', action: 'open_business' },
            { label: 'Compare All Types', action: 'compare_accounts' },
            { label: 'Start Application', action: 'start_application' }
          ]
        };
      case 'transfer':
        return {
          id: Date.now().toString(),
          text: "I can help you with money transfers! We offer several transfer options:\n\n• **Internal Transfers** - Between your accounts (Free, Instant)\n• **External Transfers** - To other banks ($3.00, 1-3 days)\n• **Wire Transfers** - Same day ($25.00)\n• **International Wires** - Global transfers ($45.00, 1-5 days)\n• **Mobile Payments** - Phone/email transfers (Free, Instant)\n\nWhich type of transfer do you need help with?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Internal Transfer', action: 'internal_transfer' },
            { label: 'External Transfer', action: 'external_transfer' },
            { label: 'Wire Transfer', action: 'wire_transfer' },
            { label: 'International Wire', action: 'international_wire' }
          ]
        };
      case 'fees':
        return {
          id: Date.now().toString(),
          text: "Here's our transparent fee structure:\n\n**Transfer Fees:**\n• Internal transfers: Free\n• External transfers: $3.00\n• Wire transfers: $25.00\n• International wires: $45.00\n\n**Account Fees:**\n• Monthly maintenance: $0 (no monthly fees)\n• ATM withdrawals: Free at our network\n• Overdraft protection: $35.00\n\n**Other Services:**\n• Check orders: $25.00\n• Stop payment: $30.00\n• Wire recall: $15.00\n\nWould you like details about any specific fee?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Transfer Fees', action: 'transfer_fees' },
            { label: 'Account Benefits', action: 'account_benefits' },
            { label: 'Fee Waiver Options', action: 'fee_waivers' }
          ]
        };
      case 'security':
        return {
          id: Date.now().toString(),
          text: "Your security is our top priority! Here's how we protect you:\n\n**Security Features:**\n• 256-bit SSL encryption\n• Two-factor authentication (2FA)\n• Biometric login (fingerprint/face)\n• Real-time fraud monitoring\n• FDIC insurance up to $250,000\n\n**Security Tips:**\n• Never share passwords or PINs\n• Use strong, unique passwords\n• Enable account alerts\n• Log out completely after banking\n\nHave you noticed any suspicious activity?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Report Fraud', action: 'report_fraud' },
            { label: 'Security Settings', action: 'security_settings' },
            { label: 'Enable 2FA', action: 'enable_2fa' },
            { label: 'Security Tips', action: 'security_tips' }
          ]
        };

      case 'mobile':
        return {
          id: Date.now().toString(),
          text: "Our mobile app offers complete banking on-the-go!\n\n**App Features:**\n• Account balances and transactions\n• Money transfers and bill pay\n• Mobile check deposit\n• ATM and branch locator\n• Investment tracking\n• Budgeting tools\n\n**Download:**\n• iOS: App Store\n• Android: Google Play\n\n**Security:**\n• Biometric login\n• App-specific PIN\n• Auto-logout protection\n\nNeed help setting up the app?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Download Links', action: 'download_app' },
            { label: 'Setup Guide', action: 'app_setup' },
            { label: 'App Features', action: 'app_features' },
            { label: 'Troubleshooting', action: 'app_troubleshoot' }
          ]
        };
      case 'loan':
        return {
          id: Date.now().toString(),
          text: "We offer competitive lending solutions for all your needs:\n\n**Personal Loans:**\n• Personal loans: 3.5% - 15.99% APR\n• Auto loans: 2.99% - 8.99% APR\n• Home mortgages: 3.25% - 7.50% APR\n• Student loans: 4.50% - 12.99% APR\n\n**Business Loans:**\n• Business term loans\n• Lines of credit\n• Equipment financing\n• Commercial real estate\n\n**Features:**\n• Quick pre-approval\n• Competitive rates\n• Flexible terms\n• No prepayment penalties\n\nWhat type of loan interests you?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Personal Loans', action: 'personal_loans' },
            { label: 'Business Loans', action: 'business_loans' },
            { label: 'Mortgage Info', action: 'mortgage_info' },
            { label: 'Loan Calculator', action: 'loan_calculator' }
          ]
        };
      case 'card':
        return {
          id: Date.now().toString(),
          text: "We offer premium cards with excellent benefits:\n\n**Debit Cards:**\n• Global acceptance (Visa/Mastercard)\n• Contactless payments\n• ATM access worldwide\n• Real-time transaction alerts\n• Fraud protection\n\n**Credit Cards:**\n• Rewards credit cards\n• Business credit cards\n• Secured credit cards\n• Premium travel cards\n\n**Features:**\n• No foreign transaction fees\n• 24/7 customer support\n• Mobile wallet compatibility\n• Instant card lock/unlock\n\nWhich type of card do you need?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Debit Cards', action: 'debit_cards' },
            { label: 'Credit Cards', action: 'credit_cards' },
            { label: 'Card Benefits', action: 'card_benefits' },
            { label: 'Apply for Card', action: 'apply_card' }
          ]
        };
      case 'hours':
        return {
          id: Date.now().toString(),
          text: "We're here to serve you around the clock!\n\n**Customer Support:**\n• AI Chat: 24/7 (right here!)\n• Phone Support: 24/7 at (555) 123-4567\n• Email: support@ubasfintrust.com\n• Live Chat: 24/7 on our website\n\n**Branch Hours:**\n• Monday - Friday: 9:00 AM - 6:00 PM\n• Saturday: 9:00 AM - 2:00 PM\n• Sunday: Closed\n• Holiday hours may vary\n\n**Digital Banking:**\n• Online Banking: 24/7\n• Mobile App: 24/7\n• ATMs: 24/7 access\n\nHow can I help you right now?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Call Support', action: 'call_support' },
            { label: 'Find Branch', action: 'find_branch' },
            { label: 'Email Support', action: 'email_support' },
            { label: 'Live Chat', action: 'live_chat' }
          ]
        };
      case 'branch':
        return {
          id: Date.now().toString(),
          text: "Find a UBAS Financial Trust location near you:\n\n**Branch Locator:**\n• Use our website branch locator\n• Call (555) 123-4567 for directions\n• Search \"UBAS Financial Trust\" in maps\n\n**Services Available:**\n• Account opening and management\n• Loan consultations\n• Investment advisory\n• Safe deposit boxes\n• Notary services\n• Foreign exchange\n\n**Popular Locations:**\n• Downtown Financial District\n• Business Park Branch\n• Airport Terminal Branch\n• University Campus Branch\n\nWould you like directions to a specific branch?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Find Nearest Branch', action: 'find_branch' },
            { label: 'Branch Services', action: 'branch_services' },
            { label: 'Schedule Appointment', action: 'schedule_appointment' },
            { label: 'ATM Locator', action: 'atm_locator' }
          ]
        };
      case 'investment':
        return {
          id: Date.now().toString(),
          text: "Grow your wealth with our investment solutions:\n\n**Investment Products:**\n• Certificates of Deposit (CDs): 4.5% - 5.2% APY\n• Mutual Funds: Diversified portfolios\n• ETFs: Low-cost index funds\n• Target-Date Funds: Retirement planning\n• Individual Stocks & Bonds\n• REITs: Real estate investment\n\n**Wealth Management:**\n• Personal financial advisors\n• Portfolio management\n• Retirement planning\n• Estate planning\n• Tax optimization\n\n**Minimums:**\n• ETFs: $100\n• CDs: $1,000\n• Mutual Funds: $500\n• Wealth Management: $100,000\n\nWhat's your investment goal?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Investment Options', action: 'investment_options' },
            { label: 'Retirement Planning', action: 'retirement_planning' },
            { label: 'Wealth Management', action: 'wealth_management' },
            { label: 'Risk Assessment', action: 'risk_assessment' }
          ]
        };

      case 'problem':
        return {
          id: Date.now().toString(),
          text: "I'm sorry you're experiencing an issue. I'm here to help resolve it quickly!\n\n**Common Issues I Can Help With:**\n• Login problems\n• Transaction questions\n• Card issues\n• App troubleshooting\n• Account access\n• Password reset\n\n**For Urgent Issues:**\n• Fraud or security concerns\n• Lost/stolen cards\n• Unauthorized transactions\n• Account lockouts\n\nPlease describe your specific issue, and I'll provide the best solution or connect you with the right specialist immediately.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Login Issues', action: 'login_help' },
            { label: 'Card Problems', action: 'card_issues' },
            { label: 'Report Fraud', action: 'report_fraud' },
            { label: 'Urgent Help', action: 'urgent_help' }
          ]
        };
      default:
        // Intelligent default response based on message analysis
        const isQuestion = lowerMessage.includes('?') || lowerMessage.startsWith('how') || lowerMessage.startsWith('what') || lowerMessage.startsWith('when') || lowerMessage.startsWith('where') || lowerMessage.startsWith('why');
        const isGreeting = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'].some(greeting => lowerMessage.includes(greeting));
        const isComplaint = ['problem', 'issue', 'error', 'wrong', 'bad', 'terrible', 'awful', 'frustrated'].some(word => lowerMessage.includes(word));

        if (isGreeting) {
          return {
            id: Date.now().toString(),
            text: "Hello! Welcome to UBAS Financial Trust. I'm your AI banking assistant, and I'm here to help you with all your banking needs. I can assist with account information, transfers, loans, investments, and much more. What can I help you with today?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quick-reply',
            actions: [
              { label: 'Account Services', action: 'account_services' },
              { label: 'Transfer Money', action: 'transfer_money' },
              { label: 'Open Account', action: 'open_account' },
              { label: 'Get Support', action: 'get_support' }
            ]
          };
        }

        if (isComplaint) {
          return {
            id: Date.now().toString(),
            text: "I'm sorry to hear you're having an issue. Your satisfaction is very important to us, and I want to help resolve this as quickly as possible. Can you please tell me more about the specific problem you're experiencing? I'll do my best to help or connect you with the right specialist.",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quick-reply',
            actions: [
              { label: 'Describe Issue', action: 'describe_issue' },
              { label: 'Urgent Support', action: 'urgent_support' },
              { label: 'File Complaint', action: 'file_complaint' },
              { label: 'Speak to Manager', action: 'speak_manager' }
            ]
          };
        }

        if (isQuestion) {
          return {
            id: Date.now().toString(),
            text: "That's a great question! I have extensive knowledge about UBAS Financial Trust services and can help with most banking inquiries. Could you provide a bit more detail about what you'd like to know? I can assist with accounts, transfers, loans, investments, cards, security, and much more.",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quick-reply',
            actions: [
              { label: 'Account Questions', action: 'account_questions' },
              { label: 'Service Information', action: 'service_info' },
              { label: 'How-To Guides', action: 'how_to_guides' },
              { label: 'Connect to Agent', action: 'human_agent' }
            ]
          };
        }

        // General fallback
        return {
          id: Date.now().toString(),
          text: "I understand you're looking for assistance. As your AI banking assistant, I can help with a wide range of topics including account management, transfers, loans, investments, security, and general banking questions. Could you please rephrase your question or let me know what specific area you need help with?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quick-reply',
          actions: [
            { label: 'Popular Topics', action: 'popular_topics' },
            { label: 'Account Help', action: 'account_help' },
            { label: 'Connect to Human', action: 'human_agent' },
            { label: 'Browse Services', action: 'browse_services' }
          ]
        };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    let responseText = '';
    let actions: Array<{ label: string; action: string }> = [];

    switch (action) {
      case 'account_info':
        responseText = "I can help you with account information. Please log into your account to view balances, transaction history, and account details. If you need help logging in, I can guide you through the process.";
        actions = [
          { label: 'Login Help', action: 'login_help' },
          { label: 'Forgot Password', action: 'forgot_password' }
        ];
        break;
      case 'transfer':
        responseText = "To make a transfer, log into your account and go to the Transfers section. You can transfer between your accounts instantly for free, or send money to external accounts with small fees.";
        actions = [
          { label: 'Transfer Guide', action: 'transfer_guide' },
          { label: 'Transfer Limits', action: 'transfer_limits' }
        ];
        break;
      case 'human_agent':
        responseText = "I'm connecting you with a human agent. Please hold while I transfer your chat. Our agents are available 24/7 to assist you with any banking needs.";
        actions = [
          { label: 'Call Instead', action: 'call_support' },
          { label: 'Email Support', action: 'email_support' }
        ];
        break;
      case 'open_personal':
        responseText = "Personal banking accounts start with a $1,000 minimum balance and include free transfers, global debit cards, mobile banking, and 24/7 support. Would you like to start the application process?";
        actions = [
          { label: 'Start Application', action: 'start_personal_app' },
          { label: 'Learn More', action: 'personal_benefits' }
        ];
        break;
      default:
        responseText = "I'm here to help! What specific information do you need?";
        actions = [
          { label: 'Account Questions', action: 'account_info' },
          { label: 'Transfer Help', action: 'transfer' }
        ];
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      type: 'quick-reply',
      actions: actions
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Need help? Chat with us!
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        <CardHeader className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <div>
                <CardTitle className="text-lg">UBAS AI Assistant</CardTitle>
                <p className="text-blue-100 text-sm">Online • Typically replies instantly</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-blue-700"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[536px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Reply Actions */}
                    {message.type === 'quick-reply' && message.actions && (
                      <div className="mt-2 space-y-1">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.action)}
                            className="mr-2 mb-1 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by UBAS AI • Available 24/7
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
