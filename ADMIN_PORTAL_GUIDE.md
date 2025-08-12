# 🔐 UBAS Financial Trust - Admin Portal Guide  
> For full deployment, DNS, notification providers, grants, loans, and scaling procedures see `COMPLETE_OPERATIONS_MANUAL.md`.

## 🎯 **COMPLETE ADMIN CONTROL SYSTEM**

Your UBAS Financial Trust application now includes a **comprehensive admin portal** that gives you complete control over all customer data, accounts, transactions, and system settings. Perfect for client demonstrations and data management!

---

## 🚀 **ACCESSING THE ADMIN PORTAL**

### **Admin Portal URL:**
- **Local:** http://localhost:8081/admin
- **From Homepage:** Click "Admin Portal" link in the footer

### **Admin Login Credentials (Seeded Corporate User):**
```
Email: (value of ADMIN_EMAIL in backend env)  # default admin@ubasfintrust.com
Password: (value of ADMIN_PASSWORD)          # default ChangeMe#12345
```
Change the password immediately after first login (Profile → Change Password).

---

## 🏛️ **ADMIN PORTAL FEATURES**

### **📊 System Overview Dashboard**
- **Real-time Statistics:** Total customers, accounts, balances, transactions
- **Recent Activity:** Latest customer registrations and transactions
- **System Status:** Online status and health monitoring
- **Quick Actions:** Fast access to common admin tasks

### **👥 Customer Management**
- ✅ **Create New Customers** - Add customers with full details
- ✅ **Edit Customer Information** - Update names, emails, account types
- ✅ **Delete Customers** - Remove customers and all associated data
- ✅ **Search & Filter** - Find customers by name, email, or username
- ✅ **Account Type Management** - Personal, Business, Corporate, Private
- ✅ **KYC Status Control** - Approve/reject customer verification

### **💳 Account Management**
- ✅ **Create Accounts** - Add checking, savings, credit, investment, business accounts
- ✅ **Update Balances** - Set any balance amount for any account
- ✅ **Account Types** - Full support for all banking account types
- ✅ **Interest Rates** - Set custom interest rates for savings accounts
- ✅ **Credit Limits** - Configure credit limits for credit accounts
- ✅ **Account Status** - Activate, freeze, or close accounts

### **💰 Transaction Management**
- ✅ **Create Transactions** - Add credit/debit transactions to any account
- ✅ **Transaction Categories** - Income, Shopping, Utilities, Transfers, etc.
- ✅ **Real-time Balance Updates** - Balances update automatically
- ✅ **Transaction History** - View all system transactions
- ✅ **Custom Dates** - Set transaction dates for historical data

---

## 📋 **STEP-BY-STEP ADMIN WORKFLOW**

### **🎯 Setting Up for Client Demo**

#### **Step 1: Create Demo Customers**
1. Go to **Customer Management**
2. Click **"Add Customer"**
3. Fill in customer details:
   - **Username:** `demo.customer`
   - **Email:** `demo@example.com`
   - **Full Name:** `Demo Customer`
   - **Phone:** `+1-555-0123`
   - **Account Type:** `Personal`
   - **Password:** `demo123`
4. Click **"Create Customer"**

#### **Step 2: Create Accounts for Customer**
1. Go to **Account Management**
2. Click **"Create Account"**
3. Select the customer you just created
4. Create multiple accounts:
   - **Primary Checking** - $5,000 balance
   - **High Yield Savings** - $25,000 balance (4.25% APY)
   - **Credit Card** - $10,000 credit limit

#### **Step 3: Add Transaction History**
1. Go to **Transaction Management**
2. Click **"Add Transaction"**
3. Create realistic transactions:
   - **Salary Deposit** - $5,200 credit
   - **Grocery Shopping** - $127 debit
   - **Gas Station** - $45 debit
   - **Interest Payment** - $85 credit

#### **Step 4: Client Login Demo**
- Customer can now login with: `demo.customer` / `demo123`
- They'll see their accounts, balances, and transaction history
- All data is real and functional!

---

## 🎨 **CUSTOMIZATION OPTIONS**

### **Account Types Available:**
- **Personal Banking** - Individual customers
- **Business Banking** - Small to medium businesses
- **Corporate Banking** - Large enterprises
- **Private Banking** - High-net-worth individuals

### **Account Categories:**
- **Checking Accounts** - Daily banking needs
- **Savings Accounts** - Interest-bearing deposits
- **Credit Accounts** - Credit cards and lines of credit
- **Investment Accounts** - Portfolio management
- **Business Accounts** - Commercial banking

### **Transaction Categories:**
- Income, Shopping, Utilities, Food & Dining
- Transportation, Healthcare, Entertainment
- Transfers, Interest, Fees, Other

---

## 💡 **ADMIN BEST PRACTICES**

### **For Client Demonstrations:**
1. **Create Realistic Data** - Use believable names, amounts, and dates
2. **Multiple Account Types** - Show different banking services
3. **Transaction Variety** - Mix of credits, debits, and categories
4. **Balanced Portfolios** - Appropriate balances for account types

### **Data Management:**
1. **Regular Cleanup** - Remove test data between demos
2. **Backup Important Data** - Save customer configurations
3. **Consistent Naming** - Use clear, professional naming conventions
4. **Security** - Always logout of admin portal after use

---

## 🔧 **TECHNICAL FEATURES (Updated)**

### **Real-time Updates:**
- All changes reflect immediately in customer dashboards
- Balances update automatically with transactions
- Transaction history appears instantly

### **Data Persistence:**
Primarily persisted in PostgreSQL (customers, accounts, transactions, loans, grants, templates). LocalStorage now used only for session tokens / light UI state.

### **Security:**
- Separate admin authentication system
- Protected admin routes
- Secure session management

---

## 🎯 **DEMO SCENARIOS**

### **Scenario 1: Personal Banking Demo**
```
Customer: John Smith (john.smith / demo123)
Accounts: 
- Checking: $3,247.82
- Savings: $15,430.50
- Credit Card: $2,500 limit, $347 balance
Transactions: Salary, groceries, gas, online shopping
```

### **Scenario 2: Business Banking Demo**
```
Customer: ABC Company (abc.company / demo123)
Accounts:
- Business Checking: $45,230.00
- Business Savings: $125,000.00
- Business Credit Line: $50,000 limit
Transactions: Client payments, supplier payments, payroll
```

### **Scenario 3: Private Banking Demo**
```
Customer: Wealth Client (wealth.client / demo123)
Accounts:
- Private Checking: $50,000.00
- Investment Portfolio: $1,250,000.00
- Private Credit Line: $500,000 limit
Transactions: Investment gains, luxury purchases, transfers
```

---

## 🚀 **QUICK ADMIN ACTIONS**

### **Create Customer in 30 Seconds:**
1. Admin Portal → Customer Management → Add Customer
2. Fill basic info → Create Customer
3. Account Management → Create Account → Set balance
4. Done! Customer can login immediately

### **Update Account Balance:**
1. Admin Portal → Account Management
2. Find account → Click "Update Balance"
3. Enter new amount → Update Balance
4. Customer sees new balance instantly

### **Add Transaction:**
1. Admin Portal → Transaction Management
2. Add Transaction → Select customer/account
3. Enter amount and description → Create
4. Appears in customer transaction history

---

## 📞 **ADMIN SUPPORT**

### **Admin Portal Access:**
- **URL:** `/admin`
- **Username:** `admin`
- **Password:** `admin123`

### **Key Features:**
- ✅ Complete customer lifecycle management
- ✅ Real-time account and balance control
- ✅ Transaction creation and management
- ✅ Multi-account type support
- ✅ Professional admin interface
- ✅ Instant customer dashboard updates

---

## 🎉 **READY FOR CLIENT DEMOS**

Your admin portal provides **complete control** over the banking system:

✅ **Create any customer scenario**  
✅ **Set realistic account balances**  
✅ **Generate transaction history**  
✅ **Manage all account types**  
✅ **Real-time system control**  
✅ **Professional admin interface**  

**🔐 Access Admin Portal:** http://localhost:8081/admin  
**👤 Admin Login:** ADMIN_EMAIL / ADMIN_PASSWORD (environment)

**🎯 Perfect for client demonstrations and system management!**

---

*Admin Portal Version: 1.0.0*  
*Last Updated: August 2025*
