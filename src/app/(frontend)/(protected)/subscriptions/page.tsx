'use client'

import { useState, useEffect } from 'react'
import { Heart, Search, Plus, Loader2 } from 'lucide-react' // Import Loader2 for the spinner
import { useUser } from '@/context/user-context' // Import the useUser hook

type Tool = {
  id: string
  title: string
  description: string
  image: string
  likes: { user: string }[] // Array of objects with a `user` property
  enrolled: { user: string }[] // Array of objects with a `user` property
}

const ToolsGrid = () => {
  const [tools, setTools] = useState<Tool[]>([])
  const [liked, setLiked] = useState<boolean[]>([])
  const [enrolled, setEnrolled] = useState<boolean[]>([])
  const [popupVisible, setPopupVisible] = useState(false)
  const [addToolPopupVisible, setAddToolPopupVisible] = useState(false)
  const [currentToolIndex, setCurrentToolIndex] = useState<number | null>(null)
  const [action, setAction] = useState<'enroll' | 'unroll' | ''>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true) // State to track loading status

  const { user, isLoading: isUserLoading } = useUser() // Use the user from the context
  const isAdmin = user?.role === 'admin' // Check if the user is an admin

  // Fetch tools on component mount
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools`)
        if (!response.ok) {
          throw new Error('Failed to fetch tools')
        }
        const data = await response.json()
        console.log('Fetched tools:', data.docs) // Log the tools array
        setTools(data.docs || []) // Payload CMS returns tools in `docs` array

        // Initialize `liked` and `enrolled` states based on the current user's ID
        setLiked(data.docs.map((tool: Tool) => tool.likes.some((like) => like.user === user?.id)))
        setEnrolled(
          data.docs.map((tool: Tool) => tool.enrolled.some((enroll) => enroll.user === user?.id)),
        )
      } catch (error) {
        console.error('Error fetching tools:', error)
      } finally {
        setIsLoading(false) // Mark loading as complete
      }
    }

    fetchTools()
  }, [user?.id])

  // Handle like/unlike a tool
  const toggleLike = async (index: number) => {
    const tool = tools[index];
    const userId = user?.id; // Use the logged-in user's ID
  
    if (!tool || !userId) return; // Ensure tool and user ID exist
  
    try {
      const updatedLikes = liked[index]
        ? (tool.likes ?? []).filter((like) => like.user !== userId) // Remove like
        : [...(tool.likes ?? []), { user: userId }]; // Add like
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: tool.id, // Include the tool ID
          likes: updatedLikes, // Include the updated likes array
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update likes');
      }
  
      const updatedTool = await response.json();
      const updatedTools = [...tools];
      updatedTools[index] = updatedTool;
      setTools(updatedTools);
  
      const updatedLiked = [...liked];
      updatedLiked[index] = !liked[index];
      setLiked(updatedLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle enroll/unenroll in a tool
  const toggleEnrollment = async (index: number) => {
    const tool = tools[index];
    const userId = user?.id; // Use the logged-in user's ID
  
    if (!tool || !userId) return; // Ensure tool and user ID exist
  
    try {
      const updatedEnrolled = enrolled[index]
        ? (tool.enrolled ?? []).filter((enroll) => enroll.user !== userId) // Remove enrollment
        : [...(tool.enrolled ?? []), { user: userId }]; // Add enrollment
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: tool.id, // Include the tool ID
          enrolled: updatedEnrolled, // Include the updated enrolled array
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update enrollment');
      }
  
      const updatedTool = await response.json();
      const updatedTools = [...tools];
      updatedTools[index] = updatedTool;
      setTools(updatedTools);
  
      const updatedEnrolledState = [...enrolled];
      updatedEnrolledState[index] = !enrolled[index];
      setEnrolled(updatedEnrolledState);
    } catch (error) {
      console.error('Error toggling enrollment:', error);
    }
  };

  // Handle adding a new tool (admin only)
  const handleAddTool = async (toolData: { title: string; description: string; image: string }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData),
      })

      if (!response.ok) {
        throw new Error('Failed to add tool')
      }

      const newTool = await response.json()
      setTools([...tools, newTool])
      setAddToolPopupVisible(false)
    } catch (error) {
      console.error('Error adding tool:', error)
    }
  }

  // Filter tools based on search query
  const filteredTools = tools.filter((tool) =>
    (tool.title || '').toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-6xl mx-auto p-6 bg-contentBg">
      <h1 className="text-2xl font-bold text-title">Optimize your performance!</h1>
      <p className="text-text">
        From enhancing efficiency to simplifying complex processes, everything you need to excel in
        your work is just a click away.
      </p>

      {/* Search and Add Tool Button */}
      <div className="flex justify-between items-center mt-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search tools"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-cardBg rounded-md outline-none pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {isAdmin && (
          <button
            className="bg-button-bg text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setAddToolPopupVisible(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add Tool</span>
          </button>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex items-center justify-center h-64 my-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      )}

      {/* No Tools Found */}
      {!isLoading && filteredTools.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-text">No tools found.</p>
        </div>
      )}

      {/* Tools Grid */}
      {!isLoading && filteredTools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredTools.map((tool, index) => (
            <div
              key={tool.id} // Add the key prop here
              className={`relative p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer 
                ${enrolled[index] ? 'bg-button-bg text-white' : 'bg-cardBg text-text'}`}
            >
              <button onClick={() => toggleLike(index)} className="absolute top-3 right-3">
                <Heart
                  className={`w-5 h-5 transition-all duration-300 
                    ${
                      enrolled[index]
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

              <h2 className="text-lg font-semibold mt-3">{tool.title || 'Untitled Tool'}</h2>
              <p className="text-sm mt-2">{tool.description || 'No description available.'}</p>

              <button
                className={`w-full mt-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                  enrolled[index] ? 'bg-white text-blue-500' : 'bg-button-bg text-white'
                }`}
                onClick={() => {
                  setCurrentToolIndex(index)
                  setAction(enrolled[index] ? 'unroll' : 'enroll')
                  setPopupVisible(true)
                }}
              >
                {enrolled[index] ? 'Unroll' : 'Enroll'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup for Enroll/Unroll */}
      {popupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md bg-popupBg rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col items-center">
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
                  onClick={() => setPopupVisible(false)}
                >
                  Cancel
                </button>
                <button
                  className="text-sm flex-1 py-2 bg-button-bg text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    if (currentToolIndex !== null) {
                      toggleEnrollment(currentToolIndex)
                      setPopupVisible(false)
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup for Adding a New Tool */}
      {addToolPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md bg-popupBg rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold text-title text-center mb-4">Add New Tool</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const toolData = {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    image: formData.get('image') as string,
                  }
                  handleAddTool(toolData)
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 rounded-md bg-input shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter tool title"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <input
                      id="description"
                      name="description"
                      type="text"
                      className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 rounded-md bg-input shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter tool description"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="text"
                      className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 rounded-md bg-input shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter image URL"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-4 w-full">
                  <button
                    type="button"
                    className="text-sm flex-1 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    onClick={() => setAddToolPopupVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-sm flex-1 py-2 bg-button-bg text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToolsGrid
