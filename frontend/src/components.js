import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Star, 
  Flame, 
  Trophy, 
  Heart, 
  MessageCircle, 
  Highlighter,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  User,
  Volume2,
  Bookmark,
  Share,
  Settings
} from 'lucide-react';

// Mock Bible Data
const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
  'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
  'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter',
  '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const SAMPLE_VERSES = {
  'Genesis': {
    1: {
      1: "In the beginning God created the heavens and the earth.",
      2: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
      3: "And God said, 'Let there be light,' and there was light.",
      4: "God saw that the light was good, and he separated the light from the darkness.",
      5: "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day."
    }
  },
  'John': {
    3: {
      16: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      17: "For God did not send his Son into the world to condemn the world, but to save the world through him."
    }
  },
  'Psalms': {
    23: {
      1: "The Lord is my shepherd, I lack nothing.",
      2: "He makes me lie down in green pastures, he leads me beside quiet waters,",
      3: "he refreshes my soul. He guides me along the right paths for his name's sake.",
      4: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me."
    }
  }
};

// Sheep Mascot Component
const SheepMascot = ({ mood = 'happy', size = 'md', message }) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
    >
      <motion.div
        className={`${sizes[size]} rounded-full bg-white border-4 border-green-400 flex items-center justify-center relative overflow-hidden`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src="https://images.pexels.com/photos/10064767/pexels-photo-10064767.jpeg"
          alt="Sheep Mascot"
          className="w-full h-full object-cover"
        />
        {mood === 'encouraging' && (
          <motion.div
            className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </motion.div>
      {message && (
        <motion.div
          className="mt-2 bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-green-200 max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-gray-700">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Loading Screen Component
export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SheepMascot size="xl" />
        <motion.h1
          className="text-4xl font-bold text-white mt-6 mb-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          SheepLingo
        </motion.h1>
        <motion.p
          className="text-green-100 text-lg"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your journey through the Bible begins...
        </motion.p>
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ delay: i * 0.2, repeat: Infinity, duration: 1 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Home Component - Main Learning Path
export const Home = ({ userProgress, setUserProgress }) => {
  const navigate = useNavigate();

  const getBooksInRows = () => {
    const rows = [];
    for (let i = 0; i < BIBLE_BOOKS.length; i += 8) {
      rows.push(BIBLE_BOOKS.slice(i, i + 8));
    }
    return rows;
  };

  const isBookCompleted = (bookName) => {
    return userProgress.completedVerses[bookName] && 
           Object.keys(userProgress.completedVerses[bookName]).length > 0;
  };

  const isBookCurrent = (bookName) => {
    return userProgress.currentBook === bookName;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-green-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SheepMascot size="md" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SheepLingo</h1>
                <p className="text-green-600 text-sm">Bible Study Journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-orange-100 px-3 py-2 rounded-full">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-700">{userProgress.streak}</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-blue-700">{userProgress.totalXP}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <User className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Bible Journey</h2>
          <p className="text-gray-600">Choose a book to continue your study</p>
        </motion.div>

        {/* Learning Path */}
        <div className="space-y-8">
          {getBooksInRows().map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, x: rowIndex % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.1 }}
              className={`flex justify-center items-center space-x-4 ${rowIndex % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              {row.map((book, bookIndex) => {
                const isCompleted = isBookCompleted(book);
                const isCurrent = isBookCurrent(book);
                const isLocked = BIBLE_BOOKS.indexOf(book) > BIBLE_BOOKS.indexOf(userProgress.currentBook);

                return (
                  <motion.button
                    key={book}
                    onClick={() => !isLocked && navigate(`/book/${book}`)}
                    disabled={isLocked}
                    className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-sm transition-all ${
                      isLocked 
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-green-500 border-green-600 text-white shadow-lg'
                        : isCurrent
                        ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-lg animate-pulse'
                        : 'bg-white border-green-300 text-green-700 hover:border-green-500 hover:shadow-md'
                    }`}
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                  >
                    {isCompleted ? (
                      <Trophy className="w-6 h-6" />
                    ) : isLocked ? (
                      <span className="text-xs">🔒</span>
                    ) : (
                      <BookOpen className="w-6 h-6" />
                    )}
                    
                    {/* Book name tooltip */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {book}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Books Read</h3>
                <p className="text-2xl font-bold text-green-600">
                  {Object.keys(userProgress.completedVerses).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Verses Studied</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(userProgress.completedVerses).reduce((total, book) => 
                    total + Object.keys(book).length, 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Current Streak</h3>
                <p className="text-2xl font-bold text-orange-600">{userProgress.streak} days</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Book Selection Component - Duolingo Vertical Path Style
export const BookSelection = ({ userProgress, setUserProgress }) => {
  const { bookName } = useParams();
  const navigate = useNavigate();

  // Mock chapters data (simplified - assuming 50 chapters max per book)
  const getChaptersForBook = (book) => {
    const chapterCounts = {
      'Genesis': 50, 'Exodus': 40, 'Psalms': 150, 'Matthew': 28, 'John': 21
    };
    return Array.from({length: chapterCounts[book] || 25}, (_, i) => i + 1);
  };

  const chapters = getChaptersForBook(bookName);

  const isChapterCompleted = (chapter) => {
    return userProgress.completedVerses[bookName] && 
           userProgress.completedVerses[bookName][chapter];
  };

  const isChapterCurrent = (chapter) => {
    return userProgress.currentBook === bookName && 
           userProgress.currentChapter === chapter;
  };

  const isQuizChapter = (chapter) => {
    return chapter % 5 === 0;
  };

  // Create the vertical path with chapters and quizzes
  const createLearningPath = () => {
    const pathItems = [];
    
    for (let i = 1; i <= chapters.length; i++) {
      // Add chapter
      pathItems.push({
        type: 'chapter',
        number: i,
        isCompleted: isChapterCompleted(i),
        isCurrent: isChapterCurrent(i),
        isLocked: i > userProgress.currentChapter && bookName === userProgress.currentBook
      });

      // Add quiz every 5 chapters
      if (i % 5 === 0 && i < chapters.length) {
        pathItems.push({
          type: 'quiz',
          number: `Quiz ${i/5}`,
          chapterGroup: i,
          isCompleted: isChapterCompleted(i), // Quiz completed if chapter is completed
          isCurrent: false,
          isLocked: i > userProgress.currentChapter && bookName === userProgress.currentBook
        });
      }
    }
    
    return pathItems;
  };

  const pathItems = createLearningPath();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-green-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <SheepMascot size="md" message={`Let's study ${bookName}!`} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{bookName}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Vertical Learning Path */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose a Chapter</h2>
          <p className="text-gray-600">Continue your journey through {bookName}</p>
        </motion.div>

        {/* Vertical Path */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 transform -translate-x-1/2 z-0"></div>
          
          <div className="space-y-6 relative z-10">
            {pathItems.map((item, index) => {
              const handleClick = () => {
                if (item.isLocked) return;
                
                if (item.type === 'chapter') {
                  navigate(`/study/${bookName}/${item.number}/1`);
                } else if (item.type === 'quiz') {
                  navigate(`/quiz/${bookName}/${item.chapterGroup}`);
                }
              };

              return (
                <motion.div
                  key={`${item.type}-${item.number}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <motion.button
                    onClick={handleClick}
                    disabled={item.isLocked}
                    className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-sm transition-all ${
                      item.isLocked
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                        : item.isCompleted
                        ? 'bg-green-500 border-green-600 text-white shadow-lg'
                        : item.isCurrent
                        ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-lg animate-pulse'
                        : item.type === 'quiz'
                        ? 'bg-purple-500 border-purple-600 text-white hover:border-purple-700 hover:shadow-md'
                        : 'bg-white border-green-300 text-green-700 hover:border-green-500 hover:shadow-md'
                    } ${item.type === 'quiz' ? 'rounded-lg' : ''}`}
                    whileHover={!item.isLocked ? { scale: 1.1 } : {}}
                    whileTap={!item.isLocked ? { scale: 0.95 } : {}}
                  >
                    {item.isCompleted ? (
                      <Trophy className="w-6 h-6" />
                    ) : item.isLocked ? (
                      <span className="text-xs">🔒</span>
                    ) : item.type === 'quiz' ? (
                      <span className="text-xs font-bold">Q</span>
                    ) : (
                      item.number
                    )}
                  </motion.button>

                  {/* Label */}
                  <div className={`absolute ${index % 2 === 0 ? 'left-20' : 'right-20'} 
                                   bg-white px-3 py-1 rounded-lg shadow-md border-2 ${
                                   item.type === 'quiz' ? 'border-purple-200' : 'border-green-200'
                                 }`}>
                    <span className={`text-sm font-semibold ${
                      item.type === 'quiz' ? 'text-purple-700' : 'text-green-700'
                    }`}>
                      {item.type === 'quiz' ? item.number : `Chapter ${item.number}`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Legend</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white border-4 border-green-300 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-700" />
              </div>
              <span className="text-sm text-gray-700">Chapter</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 border-4 border-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">Q</span>
              </div>
              <span className="text-sm text-gray-700">Quiz</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 border-4 border-green-600 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">Completed</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 border-4 border-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 text-xs font-bold">1</span>
              </div>
              <span className="text-sm text-gray-700">Current</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Verse Study Component
export const VerseStudy = ({ 
  userProgress, 
  setUserProgress, 
  userNotes, 
  setUserNotes, 
  userHighlights, 
  setUserHighlights 
}) => {
  const { bookName, chapter, verse } = useParams();
  const navigate = useNavigate();
  
  const [currentVerse, setCurrentVerse] = useState(parseInt(verse));
  const [showNotes, setShowNotes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [chatMessages, setChatMessages] = useState([]);

  const chapterNum = parseInt(chapter);
  const verseKey = `${bookName}-${chapter}-${currentVerse}`;

  // Get verse text
  const getVerseText = () => {
    return SAMPLE_VERSES[bookName]?.[chapterNum]?.[currentVerse] || 
           `This is verse ${currentVerse} of ${bookName} chapter ${chapter}. (Sample text for demonstration)`;
  };

  // Load existing note
  useEffect(() => {
    const existingNote = userNotes[verseKey];
    setNoteText(existingNote || '');
  }, [verseKey, userNotes]);

  // Navigation functions
  const goToNextVerse = () => {
    setCurrentVerse(prev => prev + 1);
    navigate(`/study/${bookName}/${chapter}/${currentVerse + 1}`);
  };

  const goToPrevVerse = () => {
    if (currentVerse > 1) {
      setCurrentVerse(prev => prev - 1);
      navigate(`/study/${bookName}/${chapter}/${currentVerse - 1}`);
    }
  };

  // Save note
  const saveNote = () => {
    if (noteText.trim()) {
      setUserNotes(prev => ({
        ...prev,
        [verseKey]: noteText
      }));
    } else {
      setUserNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[verseKey];
        return newNotes;
      });
    }
    setShowNotes(false);
  };

  // Highlight text
  const highlightVerse = () => {
    setUserHighlights(prev => ({
      ...prev,
      [verseKey]: highlightColor
    }));
  };

  // Chat with verse
  const sendChatMessage = (message) => {
    const responses = [
      "This verse speaks about God's love and faithfulness. Consider how it applies to your life today.",
      "The historical context of this passage shows us God's plan unfolding through history.",
      "This verse connects to many other scriptures. Would you like to explore cross-references?",
      "The original Hebrew/Greek word here has deeper meaning. It emphasizes God's character.",
      "This teaching from Jesus shows us how to live according to God's will."
    ];
    
    setChatMessages(prev => [
      ...prev,
      { type: 'user', text: message },
      { type: 'sheep', text: responses[Math.floor(Math.random() * responses.length)] }
    ]);
  };

  // Mark verse as completed
  const markCompleted = () => {
    setUserProgress(prev => ({
      ...prev,
      completedVerses: {
        ...prev.completedVerses,
        [bookName]: {
          ...prev.completedVerses[bookName],
          [chapterNum]: {
            ...prev.completedVerses[bookName]?.[chapterNum],
            [currentVerse]: true
          }
        }
      },
      totalXP: prev.totalXP + 10
    }));
  };

  const isCompleted = userProgress.completedVerses[bookName]?.[chapterNum]?.[currentVerse];
  const hasNote = userNotes[verseKey];
  const hasHighlight = userHighlights[verseKey];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate(`/book/${bookName}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <SheepMascot size="md" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">{bookName} {chapter}:{currentVerse}</h1>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentVerse / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">+{isCompleted ? 10 : 0} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Study Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Verse Card */}
        <motion.div
          key={currentVerse}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className={`bg-white rounded-2xl shadow-xl border-4 p-8 mb-6 ${
            hasHighlight ? `border-${hasHighlight}-400` : 'border-green-200'
          } ${hasHighlight ? `bg-${hasHighlight}-50` : ''}`}
        >
          <div className="text-center mb-6">
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {bookName} {chapter}:{currentVerse}
            </span>
          </div>
          
          <blockquote className="text-2xl leading-relaxed text-gray-800 font-medium text-center italic">
            "{getVerseText()}"
          </blockquote>

          {hasNote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded"
            >
              <div className="flex items-start space-x-2">
                <StickyNote className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-blue-700 italic">{userNotes[verseKey]}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.button
            onClick={highlightVerse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-2 bg-yellow-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:bg-yellow-600"
          >
            <Highlighter className="w-5 h-5" />
            <span>Highlight</span>
          </motion.button>

          <motion.button
            onClick={() => setShowNotes(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:bg-blue-600"
          >
            <StickyNote className="w-5 h-5" />
            <span>Note</span>
          </motion.button>

          <motion.button
            onClick={() => setShowChat(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-2 bg-purple-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:bg-purple-600"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </motion.button>

          <motion.button
            onClick={markCompleted}
            disabled={isCompleted}
            whileHover={!isCompleted ? { scale: 1.05 } : {}}
            whileTap={!isCompleted ? { scale: 0.95 } : {}}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold shadow-lg ${
              isCompleted 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>{isCompleted ? 'Complete!' : 'Finish'}</span>
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={goToPrevVerse}
            disabled={currentVerse <= 1}
            whileHover={currentVerse > 1 ? { scale: 1.05 } : {}}
            whileTap={currentVerse > 1 ? { scale: 0.95 } : {}}
            className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-semibold ${
              currentVerse <= 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </motion.button>

          <SheepMascot 
            mood="encouraging" 
            message={isCompleted ? "Great job! Keep going!" : "You're doing amazing!"} 
          />

          <motion.button
            onClick={goToNextVerse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Notes Modal */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowNotes(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-96 max-w-90vw"
            >
              <h3 className="text-xl font-bold mb-4">Add Note</h3>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your thoughts about this verse..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowNotes(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowChat(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-96 max-w-90vw h-96"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Chat about this verse</h3>
                <SheepMascot size="sm" />
              </div>
              
              <div className="h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 mb-4">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center">Ask me anything about this verse!</p>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`mb-3 ${msg.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-2 rounded-lg max-w-xs ${
                        msg.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask about this verse..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      sendChatMessage(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Ask about this verse..."]');
                    if (input.value.trim()) {
                      sendChatMessage(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Quiz Component
export const Quiz = ({ userProgress, setUserProgress }) => {
  const { bookName, chapterGroup } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const chapterStart = parseInt(chapterGroup) - 4;
  const chapterEnd = parseInt(chapterGroup);

  // Mock quiz questions based on chapters
  const generateQuestions = () => {
    const questions = [
      {
        question: `What important themes appear in ${bookName} chapters ${chapterStart}-${chapterEnd}?`,
        options: [
          "God's creation and sovereignty",
          "Human wisdom and knowledge", 
          "Political power and warfare",
          "Economic prosperity"
        ],
        correct: 0,
        explanation: "These chapters focus on God's fundamental nature and His relationship with creation."
      },
      {
        question: `In ${bookName}, what lesson can we learn from the events in these chapters?`,
        options: [
          "Trust in human strength",
          "Faith and obedience to God",
          "Worldly success matters most",
          "Isolation from others"
        ],
        correct: 1,
        explanation: "The Bible consistently teaches the importance of faith and obedience to God's will."
      },
      {
        question: `How do these chapters in ${bookName} apply to modern life?`,
        options: [
          "They are only historical accounts",
          "They provide timeless spiritual principles",
          "They are irrelevant today",
          "They only apply to ancient cultures"
        ],
        correct: 1,
        explanation: "Biblical principles are timeless and applicable to all generations."
      },
      {
        question: `What character quality is emphasized in ${bookName} chapters ${chapterStart}-${chapterEnd}?`,
        options: [
          "Pride and self-reliance",
          "Humility and dependence on God",
          "Anger and revenge",
          "Materialism and greed"
        ],
        correct: 1,
        explanation: "The Bible consistently emphasizes humility and our need to depend on God."
      },
      {
        question: `What is the main message of these chapters in ${bookName}?`,
        options: [
          "Human achievement is most important",
          "God is faithful and loving",
          "Life has no meaning",
          "Only the strong survive"
        ],
        correct: 1,
        explanation: "Throughout Scripture, God's faithfulness and love for humanity is the central message."
      }
    ];
    return questions;
  };

  const questions = generateQuestions();

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const handleQuizComplete = () => {
    const passed = score >= 3; // 60% to pass
    
    if (passed) {
      // Mark quiz as completed and award XP
      setUserProgress(prev => ({
        ...prev,
        completedQuizzes: {
          ...prev.completedQuizzes,
          [`${bookName}-${chapterGroup}`]: true
        },
        totalXP: prev.totalXP + 50 // Bonus XP for quiz completion
      }));
    }
    
    setTimeout(() => {
      navigate(`/book/${bookName}`);
    }, 3000);
  };

  if (quizCompleted) {
    const passed = score >= 3;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl border-4 border-purple-200 text-center max-w-md"
        >
          <SheepMascot 
            size="lg" 
            mood={passed ? "encouraging" : "sympathetic"}
            message={passed ? "Great job! You passed!" : "Don't worry, try again!"} 
          />
          
          <h2 className={`text-2xl font-bold mt-4 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
            {passed ? 'Quiz Passed! 🎉' : 'Keep Studying! 📚'}
          </h2>
          
          <p className="text-gray-600 mt-2">
            You scored {score} out of {questions.length}
          </p>
          
          {passed && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg border-2 border-green-200">
              <p className="text-green-700 font-semibold">+50 XP Bonus!</p>
            </div>
          )}
          
          <div className="mt-6">
            <motion.button
              onClick={handleQuizComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl font-bold text-white ${
                passed ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              Continue Learning
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-purple-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate(`/book/${bookName}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <SheepMascot size="md" message="Time for a quiz!" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">{bookName} Quiz</h1>
              <p className="text-sm text-gray-600">Chapters {chapterStart}-{chapterEnd}</p>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1}/{questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl border-4 border-purple-200 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {questions[currentQuestion].question}
              </h2>
              
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-xl border-3 transition-all ${
                      selectedAnswer === index
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-gray-50 border-gray-200 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  whileHover={selectedAnswer !== null ? { scale: 1.05 } : {}}
                  whileTap={selectedAnswer !== null ? { scale: 0.95 } : {}}
                  className={`px-8 py-3 rounded-xl font-bold text-white ${
                    selectedAnswer !== null
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl border-4 p-8 text-center"
            >
              {selectedAnswer === questions[currentQuestion].correct ? (
                <div className="border-green-200">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-4">Correct!</h3>
                </div>
              ) : (
                <div className="border-red-200">
                  <div className="text-6xl mb-4">❌</div>
                  <h3 className="text-2xl font-bold text-red-600 mb-4">Not quite right</h3>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-blue-800">
                  <strong>Explanation:</strong> {questions[currentQuestion].explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Profile Component
export const Profile = ({ userProgress }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <HomeIcon className="w-5 h-5 text-gray-600" />
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <SheepMascot size="xl" message="You're doing great!" />
          <h2 className="text-3xl font-bold text-gray-800 mt-4">Bible Scholar</h2>
          <p className="text-gray-600">Keep up the amazing work!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100 text-center">
            <Flame className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800">Current Streak</h3>
            <p className="text-3xl font-bold text-orange-600">{userProgress.streak}</p>
            <p className="text-sm text-gray-500">days</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100 text-center">
            <Star className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800">Total XP</h3>
            <p className="text-3xl font-bold text-blue-600">{userProgress.totalXP}</p>
            <p className="text-sm text-gray-500">points</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100 text-center">
            <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800">Books Started</h3>
            <p className="text-3xl font-bold text-green-600">
              {Object.keys(userProgress.completedVerses).length}
            </p>
            <p className="text-sm text-gray-500">of 66</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 text-center">
            <Heart className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800">Verses Studied</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Object.values(userProgress.completedVerses).reduce((total, book) => 
                total + Object.keys(book).length, 0
              )}
            </p>
            <p className="text-sm text-gray-500">completed</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'First Steps', desc: 'Complete your first verse', unlocked: userProgress.totalXP > 0 },
              { name: 'Dedicated', desc: '3 day streak', unlocked: userProgress.streak >= 3 },
              { name: 'Scholar', desc: '100 XP earned', unlocked: userProgress.totalXP >= 100 },
              { name: 'Faithful', desc: '7 day streak', unlocked: userProgress.streak >= 7 }
            ].map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 text-center ${
                  achievement.unlocked 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Trophy className={`w-8 h-8 mx-auto mb-2 ${
                  achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
                }`} />
                <h4 className={`font-semibold ${
                  achievement.unlocked ? 'text-yellow-700' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </h4>
                <p className={`text-xs ${
                  achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  {achievement.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};