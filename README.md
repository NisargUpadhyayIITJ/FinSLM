# Financial Small Language Model

A Next.js application that creates a chat interface for interacting with a fine-tuned financial model hosted on Hugging Face.

## Try the app

[FinSLM](https://finslm.netlify.app)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16.0.0 or later)
- npm (v7.0.0 or later)
- A Hugging Face account and API token

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd financial-chatbot
```

Install dependencies:

```bash
npm install
```

Install shadcn/ui components:

```bash
npx shadcn@latest init
```

When prompted, select these options:

  - Would you like to use TypeScript (recommended)? → Yes
  - Which style would you like to use? → Default
  - Which color would you like to use as base color? → Slate
  - Where is your global CSS file? → app/globals.css
  - Do you want to use CSS variables for colors? → Yes
  - Where is your tailwind.config.js located? → tailwind.config.js
  - Configure the import alias for components? → @/components
  - Configure the import alias for utils? → @/lib/utils

## Configuration

Create a .env.local file in the root directory:

```bash
NEXT_PUBLIC_HF_API_TOKEN=your-hugging-face-api-token
```

Replace your-hugging-face-api-token with your actual Hugging Face API token.

## Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to:

```plaintext
http://localhost:3000
```
## Getting a Hugging Face API Token

1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name and select appropriate permissions
4. Copy the token to your .env.local file