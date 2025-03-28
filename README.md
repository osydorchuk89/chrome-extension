# Keywords Highlighter

This Chrome extension allows users to select text on a webpage, extract important keywords via Gemini API, and highlight them within the selected fragment. Hovering over a highlighted keyword displays a popup with its explanation. The extension also supports removing all highlights with a single click.

## Installation Guide

## Step 1: Clone the repository

First, clone the codebase to your local machine:

```
git clone https://github.com/<your-username>/<your-repository-name>.git
```

Navigate to the project directory:

```
cd <your-repository-name>
```

## Step 2: Install dependencies

Install the required dependencies:

```
npm install
```

## Step 3: Build the extension

Build the extension files for deployment:

```
npm run build
```

This will create a `dist/` folder containing the files needed for the Chrome extension.

## Step 4: Load the Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`
2. Enable Developer Mode.
3. Click `Load unpacked`.
4. Select the `dist/` folder from your project directory.

Your extension is now installed and ready to use!
