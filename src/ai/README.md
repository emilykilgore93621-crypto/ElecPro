# Genkit AI Flows

This directory contains the Genkit flows for the application's AI features.

## Running the Genkit Developer UI

The Genkit Developer UI allows you to inspect, debug, and manually test your AI flows. To use it, you need to run your main Next.js development server and the Genkit server in two separate terminals.

### 1. Run the Next.js App

In your first terminal, start the Next.js development server:

```bash
npm run dev
```

### 2. Run the Genkit Server

In a second terminal, start the Genkit development server:

```bash
npm run genkit:watch
```

### 3. Access the UI

Once the server is running (it will typically say "Genkit developer UI available at..."), you can access it by opening the following URL in your web browser:

**[http://localhost:4000](http://localhost:4000)**

In the UI, you will find a list of all your defined flows. You can select any flow to view its details, see a history of its runs (traces), and manually execute it with custom inputs.
