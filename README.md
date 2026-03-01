# ABOVE_INFLUENCE

**Namaste 🙏**

A web application that analyzes your YouTube consumption patterns and provides AI-powered insights into how influencers shape your mindset and worldview.

## 🎯 What It Does

ABOVE_INFLUENCE helps you understand if your content consumption aligns with your life goals by analyzing:
- Your YouTube subscriptions
- Your liked videos
- Influence tactics used by creators
- Content category breakdown
- Risk assessment for each channel
- Personalized recommendations

## 🚀 Live Demo

[Visit ABOVE_INFLUENCE](https://above-influence.vercel.app/)

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Inline CSS with orange-blue theme
- **Authentication:** Google OAuth 2.0
- **Backend Workflow:** n8n (workflow automation)
- **AI Analysis:** Google Gemini AI
- **Email Delivery:** Gmail API

## 📋 Features

- ✅ Secure Google OAuth authentication
- ✅ Read-only YouTube data access
- ✅ Real-time AI analysis (no data storage)
- ✅ Email report delivery
- ✅ Privacy-focused design
- ✅ Rate limit handling with model fallback

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Console account
- n8n account (free tier)
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/VA-run23/Above_Influence.git
cd Above_Influence
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# N8N Webhook URL for analysis
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url_here
```

### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://above-influence.vercel.app` (for production)
6. Copy the Client ID to your `.env` file

### 5. Set Up n8n Workflow

**Important:** For detailed n8n workflow setup instructions, see [n8n_WORKFLOW/README.md](n8n_WORKFLOW/README.md)

Quick steps:
1. Import the workflow from `n8n_WORKFLOW/ABOVE_INFLUENCE_MODEL_SWITCH.json`
2. Configure your n8n environment variables:
   - `GOOGLE_GEMINI_API_KEY`
   - `GMAIL_CLIENT_ID`
   - `N8N_WEBHOOK_ID`
3. Set up Google Gemini and Gmail credentials in n8n
4. Activate the workflow
5. Copy the webhook URL to your `.env` file

For complete step-by-step instructions on replicating the workflow, refer to the [n8n workflow setup guide](n8n_WORKFLOW/README.md).

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### 7. Build for Production

```bash
npm run build
```

## 🔐 Privacy & Security

- **No Database Storage:** Your data is analyzed in real-time and immediately discarded
- **Email-Only Reports:** Reports are sent directly to your email
- **Read-Only Access:** We only request read-only YouTube permissions
- **Transparency:** Reports are sent from our Gmail account, meaning we can technically access sent emails, but we respect your privacy and do not read individual reports

## ⚠️ Limitations

- Free-tier n8n account (expires March 12, 2026)
- Google Gemini AI rate limits apply
- Analyzes latest 30 subscriptions and 30 liked videos
- May not capture complete viewing history
- Peak usage times may cause delays

## 📊 How It Works

1. User enters their goals and authenticates with Google
2. App fetches YouTube subscriptions and liked videos
3. Data is sent to n8n workflow
4. Google Gemini AI analyzes the data
5. Report is formatted and emailed to the user

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React and Vite
- Powered by Google Gemini AI
- Workflow automation by n8n
- Inspired by the need for conscious content consumption

## 📧 Contact

For issues or questions, please open an issue on GitHub.

---

**Take control of what influences your mind.** 🚀
