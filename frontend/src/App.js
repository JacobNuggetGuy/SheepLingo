import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { 
  Home, 
  BookSelection, 
  VerseStudy, 
  Quiz,
  Profile,
  LoadingScreen
} from './components';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('sheepLingo_progress');
    return saved ? JSON.parse(saved) : {
      currentBook: 'Genesis',
      currentChapter: 1,
      currentVerse: 1,
      completedVerses: {},
      completedQuizzes: {},
      streak: 0,
      totalXP: 0,
      achievements: []
    };
  });

  const [userNotes, setUserNotes] = useState(() => {
    const saved = localStorage.getItem('sheepLingo_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [userHighlights, setUserHighlights] = useState(() => {
    const saved = localStorage.getItem('sheepLingo_highlights');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  useEffect(() => {
    localStorage.setItem('sheepLingo_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('sheepLingo_notes', JSON.stringify(userNotes));
  }, [userNotes]);

  useEffect(() => {
    localStorage.setItem('sheepLingo_highlights', JSON.stringify(userHighlights));
  }, [userHighlights]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                userProgress={userProgress} 
                setUserProgress={setUserProgress}
              />
            } 
          />
          <Route 
            path="/book/:bookName" 
            element={
              <BookSelection 
                userProgress={userProgress}
                setUserProgress={setUserProgress}
              />
            } 
          />
          <Route 
            path="/study/:bookName/:chapter/:verse" 
            element={
              <VerseStudy 
                userProgress={userProgress}
                setUserProgress={setUserProgress}
                userNotes={userNotes}
                setUserNotes={setUserNotes}
                userHighlights={userHighlights}
                setUserHighlights={setUserHighlights}
              />
            } 
          />
          <Route 
            path="/quiz/:bookName/:chapterGroup" 
            element={
              <Quiz 
                userProgress={userProgress}
                setUserProgress={setUserProgress}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <Profile 
                userProgress={userProgress}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;