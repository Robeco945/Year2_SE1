import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn(),
  },
}))

import { authAPI } from '../services/api'

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

function getEmailInput() {
  return screen.getByRole('textbox', { name: '' }) || screen.getAllByRole('textbox')[0]
}

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders sign in heading', () => {
    renderLoginPage()
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('renders sign in button', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('renders link to signup page', () => {
    renderLoginPage()
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    renderLoginPage()
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThanOrEqual(1)
    // Password input is type="password" so not a textbox
  })

  it('calls login API on form submit', async () => {
    authAPI.login.mockResolvedValue({ data: { access_token: 'token123' } })

    renderLoginPage()

    const emailInput = screen.getByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    })

    expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password')
  })

  it('stores token on successful login', async () => {
    authAPI.login.mockResolvedValue({ data: { access_token: 'mytoken' } })

    renderLoginPage()

    const emailInput = screen.getByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    })

    expect(localStorage.getItem('authToken')).toBe('mytoken')
  })

  it('navigates to home on successful login', async () => {
    authAPI.login.mockResolvedValue({ data: { access_token: 'token' } })

    renderLoginPage()

    const emailInput = screen.getByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows error message on login failure', async () => {
    authAPI.login.mockRejectedValue({
      response: { data: { detail: 'Invalid email or password' } },
    })

    renderLoginPage()

    const emailInput = screen.getByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    })

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })

  it('shows loading state while submitting', async () => {
    let resolveLogin
    authAPI.login.mockReturnValue(
      new Promise((resolve) => { resolveLogin = resolve })
    )

    renderLoginPage()

    const emailInput = screen.getByRole('textbox')
    const passwordInput = document.querySelector('input[type="password"]')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    })

    expect(screen.getByText('Signing in…')).toBeInTheDocument()

    await act(async () => {
      resolveLogin({ data: { access_token: 'token' } })
    })
  })
})
