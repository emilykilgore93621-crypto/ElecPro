# WattsUp Electrical Toolkit - Application Blueprint

This document provides a comprehensive outline of the application's architecture, using the analogy of a body to describe its components: Skeleton, Muscle, Tendons, and Fillers.

***

## The Skeleton (Core Structure & Layout)

This is the foundational framework of the app. It defines the overall page structure, navigation, and how different views are organized. It's the bone structure that everything else hangs on.

-   **`src/app/layout.tsx`**: The absolute root of the application. It sets up the main HTML structure, including the `<body>` tag, loads global CSS and fonts, and importantly, wraps everything in the `FirebaseClientProvider` to make Firebase available everywhere.
-   **`src/app/dashboard/layout.tsx`**: This is the skeleton for the entire logged-in experience. It creates the main two-column layout with the sidebar and the main content area. It also handles user authentication checks (redirecting if not logged in) and provides the user dropdown menu in the header.
-   **`src/components/main-nav.tsx`**: The navigation menu itself, located within the sidebar. It defines the links to all the different tools (Dashboard, Calculators, Guides, etc.) and handles the "locked" state for Pro features.
-   **`next.config.ts`**: The configuration file for the Next.js framework. It's part of the skeleton because it dictates how the entire application is built and served.

***

## The Muscle (Interactive Features & Logic)

This is the interactive heart of your application—the parts that perform actions and provide the core functionality. It's what makes the app *do* things.

-   **`src/app/dashboard/calculators/page.tsx`**: Contains all the logic for the Ohm's Law, Wire Sizing, Box Fill, and other electrical calculators. This is pure muscle, taking user input and producing calculated results.
-   **`src/app/dashboard/canvas/page.tsx`**: The powerhouse for the Blueprint Board. It manages the state for all elements and wires, handles drag-and-drop logic, drawing wires, the "take-off" list calculation, and exporting the canvas to PDF/PNG.
-   **`src/ai/flows/*.ts`** (e.g., `nec-quick-guide.ts`): These files are the AI "brains" (the strongest muscle!). They define the Genkit flows that take user prompts, interact with the Google AI models, and return structured answers for features like the NEC Quick Guide and the AI Image Studio.
-   **`src/app/dashboard/image-studio/actions.ts`**: This is a Server Action that connects the frontend form to the backend AI flow for image generation. It safely handles the call to the AI on the server.
-   **`src/app/auth-form.tsx`**: This component contains the logic for user sign-up, login, and password reset, directly interacting with Firebase Authentication.

***

## The Tendons (Supports & Connectors)

These are the crucial connectors that hold everything together. They manage data, state, and communication between the frontend (what you see) and the backend (the logic).

-   **`src/firebase/` directory**: This entire folder is the main tendon connecting your app to Firebase.
    -   **`config.ts`**: Holds your Firebase project credentials.
    -   **`client-provider.tsx` & `provider.tsx`**: These work together to initialize Firebase and make the `auth` and `firestore` services available to all components.
    -   **`non-blocking-login.tsx` & `non-blocking-updates.tsx`**: These files contain functions that communicate with Firebase to sign users in or save data (like the canvas) without freezing the UI.
-   **`src/hooks/use-subscription.tsx`**: A custom React hook that acts as a tendon for managing the user's subscription status ('free' vs 'pro'). Components use this hook to know whether to show or lock content.
-   **`docs/backend.json`**: This is the blueprint for your backend data structures. It's a critical tendon that defines what a "User" or a "Canvas" object looks like in Firestore, ensuring consistency.
-   **`firestore.rules`**: The security rules for your database. This tendon enforces who can read or write data, protecting user information.

***

## The Fillers (What is Seen)

These are the visual elements that make up the user interface. They are the "skin" and "face" of your application, responsible for its look, feel, and aesthetic.

-   **`src/app/globals.css`**: The main stylesheet. It defines your app's theme, including the dark mode colors, primary orange/yellow accent, and overall typography.
-   **`src/components/ui/` directory**: This is your library of reusable UI components provided by ShadCN. Every `Button`, `Card`, `Input`, `Dialog`, `Sheet`, etc., comes from here. They are the building blocks of your interface.
-   **`src/app/page.tsx`**: The main landing page. Its purpose is purely visual—to present the app's value proposition with a strong headline, description, and a "Get Started" button.
-   **Icon components (`lucide-react`)**: All the icons you see throughout the app (Calculator, Wrench, PenSquare, etc.) are fillers that provide visual cues and make the interface intuitive and professional.
-   **`src/components/app-logo.tsx`**: The main "WattsUp" lightning bolt logo, a key piece of your app's visual identity.