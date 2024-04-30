// App.tsx
import React from 'react';
import './App.css';
import { Quiz } from './components/quiz/Quiz';

function App() {
  return (
    <div className="App container mx-auto px-4 flex items-center justify-center h-screen">
      <div className="bg-purple-100 shadow-md rounded-lg p-8 max-w-lg">
        <Quiz />
      </div>
    </div>
  );
}

export default App;
