'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [role, setRole] = useState('user')
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setIsLoading(true)
    console.log({ email, password })
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', //important for cookie handling
      })

      if (!response.ok) {
        // If the response is JSON but contains an error
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      // If the response is successful
      const data = await response.json()
      console.log(data)
      // document.cookie = `payload-token=${data.token}; path=/; Secure; HttpOnly; SameSite=Strict`;
      // window.location.href = '/';

      router.refresh()
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle register
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
    formData.append('role', role)

    if (profilePicture) {
      formData.append('image', profilePicture)
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      const data = await response.json()
      document.cookie = `payload-token=${data.token}; path=/; Secure; HttpOnly; SameSite=Strict`
      window.location.href = '/'
    } catch (error) {
      console.error('Registration error:', error)
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600 backdrop-blur-lg">
      <div className="w-full max-w-md bg-popupBg rounded-2xl shadow-xl p-6 sm:p-8 h-[80vh] overflow-y-auto">
        <div className="flex flex-col items-center h-full ">
          <h2 className="text-lg font-semibold text-title text-center">
            {isRegistering ? 'Create an account' : 'Sign in to your account'}
          </h2>

          {error && <div className="mt-2 text-sm text-red-500 text-center">{error}</div>}

          <form
            className="mt-6 w-full flex-1"
            onSubmit={isRegistering ? handleRegister : handleLogin}
          >
            <div className="space-y-4">
              {/* First Name and Last Name (for Register only) */}
              {isRegistering && (
                <>
                  <div>
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
                  <div>
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

                  {/* Role Selection */}
                  <div>
                    <label htmlFor="role" className="block text-sm text-text">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      className="w-full px-4 py-2 bg-gray-100 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Profile Picture Upload */}
                  <div>
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
                  </div>
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
