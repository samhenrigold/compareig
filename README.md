# [Instagram Follower Analyzer](https://instadiff.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/482c1013-50da-4c8f-92b1-5a9ece798e31/deploy-status)](https://app.netlify.com/sites/instadiff/deploys)

## Overview

Instagram Follower Analyzer is a web-based tool that helps you analyze your Instagram followers and following list. It provides insights into who doesn't follow you back, who you don't follow back, and your mutual followers.

## Features

- Analyze your Instagram followers and following list
- Identify users who don't follow you back
- Identify users you don't follow back
- Display mutual followers
- Completely client-side processing

## How It Works

1. Download your Instagram data from the Instagram app or website
2. Drop the ZIP file containing your Instagram data onto the web page or select it using the file picker
3. The tool processes your data entirely in your browser
4. View the results of the analysis

## Privacy and Security

- All data processing happens locally in your browser
- No Instagram data is uploaded to any server
- The tool only reads the followers and following lists from your Instagram data
- Can be used offline once the page has loaded

### Metrics
I’m using Plausible to track visits to the site. I’m also using it to see if people use certain features of the site. The custom events measured are:
- More Info: Expanded
- More Info: Scroll Tutorial
- File: Archive Uploaded
  - If it was successful, no additional information is attached.
    - If it failed, one of the following error messages will be attached:
        - 'Connections directory not found in the ZIP'
        - 'followers_and_following directory not found'
        - 'Required files not found in the ZIP'
        - 'No user data found in the HTML'
        - 'Unsupported file type. Please upload a ZIP or HTML file.'
        - 'Invalid input: expected a File object'
- Results: Copy to Clipboard
  - Includes if we could copy rich text or if we had to fallback to plain text. This helps me understand if the feature is working as expected.

You can see the data collected on the [Plausible dashboard](https://plausible.io/compareig.com).

## Technology Stack

- Svelte
- TypeScript
- Web Workers for background processing
- CSS Variables for theming

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open your browser and navigate to `http://localhost:[whatever_port_the_server_is_running_on]`

## Building for Production

To create a production build:

1. Run `npm run build`
2. The built files will be in the `dist` directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
