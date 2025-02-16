'use client';

import { useState, useEffect } from 'react';
import { Heart, Search } from 'lucide-react';

const subscriptions = [
  {
    id: 1,
    title: 'SEO Optimization',
    enrolled: false,
    description: 'Boost your website visibility and search rankings with advanced SEO tools.',
    image: '/subscription.png',
  },
  {
    id: 2,
    title: 'Marketing Automation',
    enrolled: false,
    description: 'Automate your marketing efforts and reach your audience more efficiently.',
    image: '/subscription.png',
  },
  {
    id: 3,
    title: 'Social Media Insights',
    enrolled: false,
    description: 'Get deep insights into your social media engagement and performance.',
    image: '/subscription.png',
  },
  {
    id: 4,
    title: 'Data Analytics Pro',
    enrolled: false,
    description: 'Analyze data trends and make data-driven business decisions.',
    image: '/subscription.png',
  },
  {
    id: 5,
    title: 'Email Marketing Suite',
    enrolled: false,
    description: 'Create and manage email campaigns that convert leads into customers.',
    image: '/subscription.png',
  },
];

const ToolsGrid = () => {
  const [liked, setLiked] = useState<boolean[]>([]);
  const [enrolled, setEnrolled] = useState<boolean[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentToolIndex, setCurrentToolIndex] = useState<number | null>(null);
  const [action, setAction] = useState<'enroll' | 'unroll' | ''>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load initial state from localStorage
  useEffect(() => {
    const loadStateFromStorage = () => {
      try {
        const storedEnrollments = localStorage.getItem('enrollments');
        const storedLikes = localStorage.getItem('liked');
        
        setEnrolled(storedEnrollments 
          ? JSON.parse(storedEnrollments) 
          : Array(subscriptions.length).fill(false));
        
        setLiked(storedLikes 
          ? JSON.parse(storedLikes) 
          : Array(subscriptions.length).fill(false));
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        setEnrolled(Array(subscriptions.length).fill(false));
        setLiked(Array(subscriptions.length).fill(false));
      }
    };

    loadStateFromStorage();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const saveToStorage = () => {
      try {
        if (enrolled.length > 0) {
          localStorage.setItem('enrollments', JSON.stringify(enrolled));
        }
        if (liked.length > 0) {
          localStorage.setItem('liked', JSON.stringify(liked));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    saveToStorage();
  }, [enrolled, liked]);

  const toggleEnrollment = (index: number) => {
    setEnrolled(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const toggleLike = (index: number) => {
    setLiked(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    setCurrentToolIndex(null);
    setAction('');
  };

  const handleContinue = () => {
    if (currentToolIndex !== null) {
      if (action === 'enroll' || action === 'unroll') {
        toggleEnrollment(currentToolIndex);
      }
      setPopupVisible(false);
      setAction('');
    }
  };

  const filteredSubscriptions = subscriptions.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-contentBg">
      <h1 className="text-2xl font-bold text-title">
        Optimize your performance!
      </h1>
      <p className="text-text">
        From enhancing efficiency to simplifying complex processes, everything
        you need to excel in your work is just a click away.
      </p>

      <div className="relative mt-4 max-w-md">
        <input
          type="text"
          placeholder="Search tools"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-cardBg rounded-md outline-none pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredSubscriptions.map((tool, index) => (
          <div
            key={tool.id}
            className={`relative p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer 
              ${enrolled[index] ? 'bg-button-bg text-white' : 'bg-cardBg text-text'}`}
          >
            <button
              onClick={() => toggleLike(index)}
              className="absolute top-3 right-3"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 
                  ${enrolled[index]
                    ? liked[index]
                      ? 'text-white fill-white border-white'
                      : 'text-white border-white'
                    : liked[index]
                    ? 'text-blue-500 fill-blue-500 border-blue-500'
                    : 'text-gray-400 border-gray-400'
                  }`}
                style={{
                  strokeWidth: '2',
                  stroke: liked[index] || enrolled[index] ? '' : 'currentColor',
                }}
              />
            </button>

            <div className="h-8 w-12 bg-subscription-image bg-cover bg-center"></div>

            <h2 className="text-lg font-semibold mt-3">{tool.title}</h2>
            <p className="text-sm mt-2">{tool.description}</p>

            <button
              className={`w-full mt-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                enrolled[index] ? 'bg-white text-blue-500' : 'bg-button-bg text-white'
              }`}
              onClick={() => {
                setCurrentToolIndex(index);
                setAction(enrolled[index] ? 'unroll' : 'enroll');
                setPopupVisible(true);
              }}
            >
              {enrolled[index] ? 'Unroll' : 'Enroll'}
            </button>
          </div>
        ))}
      </div>

      {popupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md bg-popupBg rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 text-red-500 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <h2 className="text-lg font-semibold text-title text-center">
                {action === 'enroll'
                  ? 'Are you sure you want to enroll?'
                  : 'Are you sure you want to unroll?'}
              </h2>
              <p className="mt-2 text-sm text-text text-center">
                {action === 'enroll'
                  ? 'Click continue to enroll and gain access to all features.'
                  : 'Click continue to unroll and stop receiving updates.'}
              </p>

              <div className="mt-6 flex gap-4 w-full">
                <button
                  className="text-sm flex-1 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={handlePopupClose}
                >
                  Cancel
                </button>
                <button
                  className="text-sm flex-1 py-2 bg-button-bg text-white rounded-md hover:bg-blue-700"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;