import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SignupPage from './SignupPage'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../services/api', () => ({
  authAPI: {
    register: jest.fn(),
  },
}))

import { authAPI } from '../services/api'

function renderSignupPage() {
  return render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>
  )
}

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders create account heading', () => {
    renderSignupPage()
    expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument()
  })

  it('renders create account button', () => {
    renderSignupPage()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('renders link to login page', () => {
    renderSignupPage()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('renders username, email, and password inputs', () => {
    renderSignupPage()
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(2) // username + email (password is type=password)
    const passwordInput = document.querySelector('input[type="password"]')
    expect(passwordInput).toBeInTheDocument()
  })

  it('calls register API on form submit', async () => {
    authAPI.register.mockResolvedValue({ data: { access_token: 'token' } })

    renderSignupPage()

    const textInputs = screen.getAllByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(textInputs[0], { target: { value: 'newuser' } }) // username
    fireEvent.change(textInputs[1], { target: { value: 'new@example.com' } }) // email
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    })

    expect(authAPI.register).toHaveBeenCalledWith('newuser', 'new@example.com', 'password123')
  })

  it('stores token on successful registration', async () => {
    authAPI.register.mockResolvedValue({ data: { access_token: 'newtoken' } })

    renderSignupPage()

    const textInputs = screen.getAllByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(textInputs[0], { target: { value: 'user' } })
    fireEvent.change(textInputs[1], { target: { value: 'u@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    })

    expect(localStorage.getItem('authToken')).toBe('newtoken')
  })

  it('navigates to home on successful registration', async () => {
    authAPI.register.mockResolvedValue({ data: { access_token: 'token' } })

    renderSignupPage()

    const textInputs = screen.getAllByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(textInputs[0], { target: { value: 'user' } })
    fireEvent.change(textInputs[1], { target: { value: 'u@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows error message on registration failure', async () => {
    authAPI.register.mockRejectedValue({
      response: { data: { detail: 'Email or username already in use' } },
    })

    renderSignupPage()

    const textInputs = screen.getAllByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(textInputs[0], { target: { value: 'existing' } })
    fireEvent.change(textInputs[1], { target: { value: 'taken@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    })

    await waitFor(() => {
      expect(screen.getByText('Email or username already in use')).toBeInTheDocument()
    })
  })

  it('shows loading state while submitting', async () => {
    let resolveRegister
    authAPI.register.mockReturnValue(
      new Promise((resolve) => { resolveRegister = resolve })
    )

    renderSignupPage()

    const textInputs = screen.getAllByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(textInputs[0], { target: { value: 'user' } })
    fireEvent.change(textInputs[1], { target: { value: 'u@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    })

    expect(screen.getByText('Creating account...')).toBeInTheDocument()

    await act(async () => {
      resolveRegister({ data: { access_token: 'token' } })
    })
  })
})
