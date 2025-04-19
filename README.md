# Echo

An AI-powered web app designed to be a supportive space for users to explore and reflect on their emotions through guided conversation.

https://github.com/user-attachments/assets/76c7ae8a-8c1f-4601-8d74-edd50d2b4165

## 🧭 Overview

In today's fast-paced world, taking a moment to check in with ourselves is more important than ever. Echo aims to be a digital companion, a friendly ear that helps you navigate your feelings. By selecting an emotion and engaging in a brief follow-up or diving straight into a chat, Echo provides a non-judgmental environment for emotional reflection.

This project is built with modern web technologies, focusing on a clean user experience and leveraging the power of conversational AI, powered by Google's Gemini API.

## 🔥 Features

*   **Emotion Selection:** Choose from a range of core emotions (Happy, Sad, Angry, Disgusted, Afraid, Surprised) to start your reflection.
*   **Guided Follow-Up:** Answer tailored questions based on your selected emotion to delve deeper.
*   **Open Conversation:** Engage in a chat with Echo to discuss your feelings further.
*   **Responsive Design:** Adapts to different screen sizes, with optimizations for mobile use.
*   **Auto-resizing Text Input:** Chat input grows as you type for a better user experience.

## 🛠️ Tech Stack

*   [SvelteKit](https://kit.svelte.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Vite](https://vitejs.dev/)
*   [Google Gemini API](https://ai.google.dev/) (for conversational AI)

## 🚀 Getting Started

Follow these instructions to get Echo running on your local machine.

**Prerequisites:**

*   Node.js (LTS version recommended)
*   npm or yarn

**Installation & Running:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/echo.git # Replace with your repo URL
    cd echo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    *   The chat functionality requires API credentials for the Google Gemini API. Create a `.env` file in the root directory.
    *   Example `.env`:
        ```dotenv
        # Required: Your Google Gemini API Key
        GOOGLE_API_KEY='your_gemini_api_key_here'
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your console).

## 💬 Usage

1.  When you first visit Echo, you'll be greeted and asked how you're feeling.
2.  Click on the button that best represents your current emotion.
3.  You'll be presented with follow-up questions. You can click a question to answer it or type your own thoughts in the text box.
4.  Click "Start Chat" (or similar button) to begin conversing with Echo based on your input.
5.  Use the chat interface to talk further. Use the "Back" or "Reset" buttons to navigate.

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, feature suggestions, or improvements to the code, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if one exists, otherwise assumed MIT).
