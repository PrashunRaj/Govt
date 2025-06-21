import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Circle, Clock, Play } from 'lucide-react';

const QuizPage = () => {
  // Expanded quiz data with more detailed questions
  const quizData = [
    {
      id: 1,
      question: "Which ancient wonder was located in Alexandria, Egypt?",
      options: ["Hanging Gardens", "Lighthouse", "Colossus", "Temple of Artemis"],
      rightAnswer: "Lighthouse",
      category: "History"
    },
    {
      id: 2,
      question: "What is the primary function of mitochondria in a cell?",
      options: ["Protein synthesis", "Energy production", "Cell division", "Waste removal"],
      rightAnswer: "Energy production",
      category: "Biology"
    },
    {
      id: 3,
      question: "Which programming paradigm focuses on declarative computation?",
      options: ["Object-Oriented", "Functional", "Procedural", "Imperative"],
      rightAnswer: "Functional",
      category: "Computer Science"
    }
  ];

  const TOTAL_TIME = 180; // 3 minutes total test time
  const [gameState, setGameState] = useState('start'); // 'start', 'ongoing', 'finished'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(quizData.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [results, setResults] = useState(null);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'ongoing' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 || gameState === 'finished') {
      handleSubmitTest();
    }

    return () => clearInterval(timer);
  }, [gameState, timeRemaining]);

  const startTest = () => {
    setGameState('ongoing');
    setTimeRemaining(TOTAL_TIME);
  };

  const handleAnswerSelect = (selectedOption) => {
    if (gameState !== 'ongoing') return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = selectedOption;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleQuestionChange = (index) => {
    if (gameState !== 'ongoing') return;
    setCurrentQuestionIndex(index);
  };

  const handleSubmitTest = () => {
    // Calculate correct answers
    const correctAnswers = quizData.filter((question, index) => 
      selectedAnswers[index] === question.rightAnswer
    );

    setResults({
      totalQuestions: quizData.length,
      correctAnswers: correctAnswers.length,
      percentage: ((correctAnswers.length / quizData.length) * 100).toFixed(2)
    });

    setGameState('finished');
  };

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Render start screen
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Challenge</h1>
          <p className="text-gray-600 mb-8">
            You have {TOTAL_TIME / 60} minutes to complete {quizData.length} questions. 
            Good luck!
          </p>
          <button 
            onClick={startTest}
            className="w-full py-3 bg-blue-500 text-white rounded-lg 
            hover:bg-blue-600 transition-colors flex items-center 
            justify-center space-x-2"
          >
            <Play className="w-6 h-6" />
            <span>Start Test</span>
          </button>
        </div>
      </div>
    );
  }

  // Render results screen
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Test Results</h1>
          <div className="mb-8">
            <p className="text-xl text-gray-700">
              You scored: {results.correctAnswers} out of {results.totalQuestions}
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {results.percentage}%
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-500 text-white rounded-lg 
            hover:bg-blue-600 transition-colors"
          >
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  // Main quiz interface
  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
      <div className="w-full h-full max-w-6xl flex overflow-hidden">
        {/* Main Quiz Area - Left Side */}
        <div className="w-3/4 h-full flex flex-col bg-white">
          <div className="flex-1 p-8 flex flex-col bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {currentQuestion.category}
                </span>
                <span className="text-gray-500">Question {currentQuestionIndex + 1} of {quizData.length}</span>
              </div>
              <div className="flex items-center space-x-2 text-red-500">
                <Clock className="w-5 h-5" />
                <span className="font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 leading-tight mb-8">
              {currentQuestion.question}
            </h2>
            
            <div className="grid grid-cols-2 gap-6 flex-1">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`
                    p-6 rounded-xl text-lg font-semibold 
                    transition-all duration-300 ease-in-out
                    border-2 group flex items-center justify-between
                    ${selectedAnswers[currentQuestionIndex] === option 
                      ? 'bg-blue-500 text-white border-blue-600 shadow-lg' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'}
                  `}
                >
                  <span>{option}</span>
                  {selectedAnswers[currentQuestionIndex] === option ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-300" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-auto pt-6">
              <button 
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg 
                disabled:opacity-50 disabled:cursor-not-allowed 
                hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={currentQuestionIndex < quizData.length - 1 
                  ? () => setCurrentQuestionIndex(prev => prev + 1)
                  : handleSubmitTest
                }
                className="px-6 py-3 bg-blue-500 text-white rounded-lg 
                hover:bg-blue-600 transition-colors 
                flex items-center space-x-2"
              >
                <span>{currentQuestionIndex < quizData.length - 1 ? 'Next' : 'Submit'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigation Sidebar - Right Side */}
        <div className="w-1/4 h-full bg-white border-l border-gray-200 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Question Navigator</h3>
          <div className="grid grid-cols-3 gap-3 auto-rows-max">
            {quizData.map((q, index) => (
              <button
                key={q.id}
                onClick={() => handleQuestionChange(index)}
                className={`
                  p-4 rounded-lg text-sm font-medium transition-all 
                  ${currentQuestionIndex === index 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}
                  ${selectedAnswers[index] !== null 
                    ? 'border-2 border-green-400' : ''}
                  flex items-center justify-center
                `}
              >
                {q.id}
              </button>
            ))}
          </div>
          <div className="mt-auto">
            <button
              onClick={handleSubmitTest}
              className="w-full py-3 bg-blue-600 text-white rounded-lg 
              hover:bg-blue-700 transition-colors font-bold"
            >
              Submit Test
            </button>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Test Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Questions answered:</span>
                <span className="font-bold">{selectedAnswers.filter(a => a !== null).length} of {quizData.length}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Time remaining:</span>
                <span className="font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;