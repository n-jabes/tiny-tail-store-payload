'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  // const [role, setRole] = useState('user')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [name, setName] = useState('')
  // const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setName(`${firstname} ${lastname}`.trim())
  }, [firstname, lastname])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      console.log(data)

      router.refresh()
      router.push('/')
      setIsRegistering(false)
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !firstname || !lastname) {
      setError('Please fill in all fields.')
      return
    }

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('firstname', firstname)
    formData.append('lastname', lastname)
    formData.append('name', name)
    formData.append('role', 'user')

    // if (profilePicture) {
    //   formData.append('image', profilePicture)
    // }

    // Log FormData contents
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value)
    // }

    const userData = {
    email,
    password,
    firstname,
    lastname,
    name,
    role: "user",
  };

    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    
      toast.success("Registration successful! Logging in...");

      // Automatically log in the user after registration
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || 'Login failed after registration');
      }

      toast.success("Login successful! Redirecting to login page...");

      // Reset all input fields
      setEmail('')
      setPassword('')
      setFirstname('')
      setLastname('')
      setName('')
      // setProfilePicture(null)
      setIsRegistering(false)

      router.refresh();
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600 backdrop-blur-lg">
      <div className="w-full max-w-md bg-popupBg rounded-2xl shadow-xl p-6 sm:p-8 h-[80vh] overflow-y-auto">
        <div className="flex flex-col items-center h-full">
          <h2 className="text-lg font-semibold text-title text-center">
            {isRegistering ? 'Create an account' : 'Sign in to your account'}
          </h2>

          {error && <div className="mt-2 text-sm text-red-500 text-center">{error}</div>}

          <form
            className="mt-6 w-full flex-1"
            onSubmit={isRegistering ? handleRegister : handleLogin}
          >
            <div className="space-y-4">
              {isRegistering && (
                <>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="firstname" className="sr-only">
                        First Name
                      </label>
                      <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-gray-100 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="First name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="lastname" className="sr-only">
                        Last Name
                      </label>
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-gray-100 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Last name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm text-text">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      readOnly
                      className="w-full px-4 py-2 bg-gray-200 text-text rounded-md focus:outline-none"
                      value={name}
                    />
                  </div>

                  {/* <div>
                    <label htmlFor="image" className="block text-sm text-text">
                      Profile Picture
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="w-full px-4 py-2 bg-gray-100 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const file = e.target?.files?.[0] ?? null
                        setProfilePicture(file)
                      }}
                    />
                  </div> */}
                </>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-2 bg-gray-100 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2 bg-gray-100 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-2 bg-button-bg text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? isRegistering
                  ? 'Registering...'
                  : 'Signing in...'
                : isRegistering
                  ? 'Register'
                  : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            {isRegistering ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setIsRegistering(false)}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Need an account?{' '}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setIsRegistering(true)}
                >
                  Register here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
