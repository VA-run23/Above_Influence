# n8n Workflow Setup Guide

This folder contains the n8n workflows for ABOVE_INFLUENCE. Follow this guide to replicate the workflow in your own n8n instance.

## 📁 Available Workflows

### 1. `ABOVE_INFLUENCE_WORKFLOW.json`
- Basic workflow with environment variables
- Single Gemini model (2.5 Flash Lite)
- Recommended for open-source setup

### 2. `ABOVE_INFLUENCE_MODEL_SWITCH.json`
- Advanced workflow with automatic model fallback
- Handles rate limits by switching between 3 Gemini models:
  - Primary: Gemini 2.5 Flash Lite
  - Fallback 1: Gemini 3 Flash
  - Fallback 2: Gemini 2.5 Flash
- Recommended for production use

### 3. `ABOVE_INFLUENCE_MODEL_SWITCH_PRODUCTION.json`
- Production version with hardcoded credentials
- **NOT included in GitHub** (in .gitignore)
- For personal use only

## 🚀 How to Replicate

### Step 1: Set Up n8n

#### Option A: n8n Cloud (Easiest)
1. Sign up at [n8n.io](https://n8n.io/)
2. Choose the free tier or paid plan
3. Access your n8n instance

#### Option B: Self-Hosted
```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Using npm
npm install n8n -g
n8n start
```

### Step 2: Get Required API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key (starts with `AI...`)

#### Gmail OAuth2 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - For n8n Cloud: `https://your-instance.app.n8n.cloud/rest/oauth2-credential/callback`
   - For self-hosted: `http://localhost:5678/rest/oauth2-credential/callback`
7. Copy Client ID and Client Secret

#### YouTube Data API
1. In the same Google Cloud project
2. Enable "YouTube Data API v3"
3. Use the same OAuth credentials

### Step 3: Configure n8n Credentials

#### Add Google Gemini Credentials
1. In n8n, go to "Credentials" → "New"
2. Search for "Google PaLM API" (used for Gemini)
3. Enter your API key
4. Save as "Google Gemini API"

#### Add Gmail OAuth2 Credentials
1. Go to "Credentials" → "New"
2. Search for "Gmail OAuth2"
3. Enter Client ID and Client Secret
4. Click "Connect my account"
5. Authorize access
6. Save as "Gmail OAuth2"

### Step 4: Set Up Environment Variables in n8n

n8n supports environment variables in two ways:

#### Option A: Using n8n Environment Variables (Recommended)
1. Go to your n8n settings
2. Add environment variables:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   GMAIL_CLIENT_ID=your_gmail_client_id_here
   N8N_WEBHOOK_ID=auto_generated_on_import
   ```

#### Option B: Using .env File (Self-Hosted Only)
Create a `.env` file in your n8n directory:
```env
# Google Gemini API Credentials
GOOGLE_GEMINI_API_KEY=your_api_key_here

# Gmail OAuth2 Credentials
GMAIL_CLIENT_ID=your_gmail_client_id_here

# N8N Webhook Configuration
N8N_WEBHOOK_ID=auto_generated_on_import
```

### Step 5: Import the Workflow

1. In n8n, click "Workflows" → "Import from File"
2. Choose `ABOVE_INFLUENCE_MODEL_SWITCH.json` (recommended)
3. The workflow will be imported with all nodes

### Step 6: Configure Workflow Nodes

#### Update Webhook Node
1. Open the "Webhook" node
2. The webhook ID will be auto-generated
3. Copy the webhook URL (e.g., `https://your-instance.app.n8n.cloud/webhook/analyze-influence`)
4. Save this URL for your frontend `.env` file

#### Configure Gemini Model Nodes
1. Open each "Gemini" model node (3 nodes if using model switch)
2. Select your "Google Gemini API" credential
3. Verify the model names:
   - `models/gemini-2.5-flash-lite`
   - `models/gemini-3-flash`
   - `models/gemini-2.5-flash`

#### Configure Gmail Node
1. Open the "Send a message" node
2. Select your "Gmail OAuth2" credential
3. Verify the email settings

### Step 7: Test the Workflow

1. Click "Execute Workflow" in n8n
2. Or use the webhook URL with a test payload:

```bash
curl -X POST https://your-instance.app.n8n.cloud/webhook/analyze-influence \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "your_youtube_access_token",
    "userEmail": "your_email@example.com",
    "userGoals": "Test goals"
  }'
```

### Step 8: Activate the Workflow

1. Toggle the "Active" switch in the top-right corner
2. The workflow is now live and ready to receive requests

### Step 9: Update Frontend Environment Variables

Update your frontend `.env` file with the webhook URL:

```env
VITE_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/analyze-influence
```

## 🔧 Workflow Architecture

```
Webhook (Receives request)
    ↓
Fetch YouTube Subscriptions
    ↓
Fetch Liked Videos
    ↓
Basic LLM Chain - Primary (Gemini 2.5 Flash Lite)
    ↓
Check Error? 
    ├─ No → Markdown Formatting → Send Email
    └─ Yes → Basic LLM Chain - Fallback 1 (Gemini 3 Flash)
              ↓
              Check Error?
                  ├─ No → Markdown Formatting → Send Email
                  └─ Yes → Basic LLM Chain - Fallback 2 (Gemini 2.5 Flash)
                            ↓
                            Markdown Formatting → Send Email
```

## 📊 Understanding the Workflow Nodes

### 1. Webhook Node
- Receives POST requests from the frontend
- Expects: `accessToken`, `userEmail`, `userGoals`

### 2. YouTube API Nodes
- Fetch subscriptions (latest 50)
- Fetch liked videos (latest 50)
- Uses user's access token for authentication

### 3. LLM Chain Nodes
- Sends data to Google Gemini for analysis
- Includes detailed prompt for analysis
- `continueOnFail: true` allows fallback on errors

### 4. Error Check Nodes
- Checks if LLM returned an error
- Routes to next model if rate limit hit

### 5. Markdown Node
- Converts AI response to HTML
- Adds user goals to the report

### 6. Gmail Node
- Sends formatted report to user's email
- Uses Gmail OAuth2 credentials

## ⚠️ Important Notes

### Rate Limits
- Google Gemini free tier has rate limits
- Model switching helps handle rate limit errors
- Consider upgrading to paid tier for production

### Webhook Security
- The webhook is public by default
- Consider adding authentication in production
- Monitor usage to prevent abuse

### Data Privacy
- No data is stored in n8n
- All processing happens in real-time
- Reports are sent via email only

### Cost Considerations
- n8n free tier: Limited executions per month
- Google Gemini: Free tier with rate limits
- Gmail API: Free for reasonable usage

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Verify your Gemini API key is correct
- Check if the key is active in Google AI Studio
- Ensure the credential is properly linked in n8n

### "Gmail Authentication Failed"
- Re-authenticate Gmail credentials in n8n
- Ensure Gmail API is enabled in Google Cloud Console
- Check OAuth redirect URIs are correct

### "Webhook Not Found"
- Ensure workflow is activated
- Verify webhook URL is correct
- Check n8n instance is running

### "Rate Limit Exceeded"
- Wait for rate limit to reset (usually 1 minute)
- Use the model switching workflow
- Consider upgrading to paid Gemini tier

### "No Email Received"
- Check spam/junk folder
- Verify email address is correct
- Check n8n execution logs for errors

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Gmail API Docs](https://developers.google.com/gmail/api)

## 🤝 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review n8n execution logs
3. Open an issue on [GitHub](https://github.com/VA-run23/Above_Influence/issues)

---

**Happy automating!** 🚀
