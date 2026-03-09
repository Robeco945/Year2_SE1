import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ProfileSettings from './ProfileSettings'

jest.mock('../services/api', () => ({
  authAPI: {
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  },
}))

import { authAPI } from '../services/api'

describe('ProfileSettings Component', () => {
  const mockUser = {
    user_id: 1,
    username: 'testuser',
    email: 'test@example.com',
    bio: 'Hello world',
    profile_picture_url: null,
  }

  const mockProps = {
    currentUser: mockUser,
    onClose: jest.fn(),
    onProfileUpdated: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders settings header', () => {
    render(<ProfileSettings {...mockProps} />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders profile and password tabs', () => {
    render(<ProfileSettings {...mockProps} />)
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<ProfileSettings {...mockProps} />)
    const closeBtn = screen.getByText('×')
    expect(closeBtn).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<ProfileSettings {...mockProps} />)
    fireEvent.click(screen.getByText('×'))
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('populates profile form with current user data', () => {
    render(<ProfileSettings {...mockProps} />)
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Hello world')).toBeInTheDocument()
  })

  it('shows avatar initial when no profile picture', () => {
    render(<ProfileSettings {...mockProps} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('shows avatar image when profile picture URL is set', () => {
    const userWithPic = { ...mockUser, profile_picture_url: 'https://example.com/pic.jpg' }
    render(<ProfileSettings {...mockProps} currentUser={userWithPic} />)
    const img = screen.getByAltText('Profile')
    expect(img).toHaveAttribute('src', 'https://example.com/pic.jpg')
  })

  it('shows character count for bio', () => {
    render(<ProfileSettings {...mockProps} />)
    expect(screen.getByText('11/200')).toBeInTheDocument()
  })

  it('saves profile successfully', async () => {
    authAPI.updateProfile.mockResolvedValue({ data: mockUser })

    render(<ProfileSettings {...mockProps} />)

    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'))
    })

    await waitFor(() => {
      expect(authAPI.updateProfile).toHaveBeenCalled()
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument()
    })
  })

  it('calls onProfileUpdated after successful save', async () => {
    authAPI.updateProfile.mockResolvedValue({ data: mockUser })

    render(<ProfileSettings {...mockProps} />)

    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'))
    })

    await waitFor(() => {
      expect(mockProps.onProfileUpdated).toHaveBeenCalledTimes(1)
    })
  })

  it('shows error on profile save failure', async () => {
    authAPI.updateProfile.mockRejectedValue({
      response: { data: { detail: 'Username already in use' } },
    })

    render(<ProfileSettings {...mockProps} />)

    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'))
    })

    await waitFor(() => {
      expect(screen.getByText('Username already in use')).toBeInTheDocument()
    })
  })

  it('switches to password tab', () => {
    render(<ProfileSettings {...mockProps} />)
    fireEvent.click(screen.getByText('Password'))
    expect(screen.getByText('Current Password')).toBeInTheDocument()
    expect(screen.getByText('New Password')).toBeInTheDocument()
    expect(screen.getByText('Confirm New Password')).toBeInTheDocument()
  })

  it('shows error when new passwords do not match', async () => {
    render(<ProfileSettings {...mockProps} />)
    fireEvent.click(screen.getByText('Password'))

    const inputs = screen.getAllByDisplayValue('')
    fireEvent.change(inputs[0], { target: { value: 'oldpass' } })
    fireEvent.change(inputs[1], { target: { value: 'newpass1' } })
    fireEvent.change(inputs[2], { target: { value: 'newpass2' } })

    await act(async () => {
      fireEvent.click(screen.getByText('Change Password'))
    })

    expect(screen.getByText('New passwords do not match')).toBeInTheDocument()
    expect(authAPI.changePassword).not.toHaveBeenCalled()
  })

  it('shows error when new password is too short', async () => {
    render(<ProfileSettings {...mockProps} />)
    fireEvent.click(screen.getByText('Password'))

    const inputs = screen.getAllByDisplayValue('')
    fireEvent.change(inputs[0], { target: { value: 'oldpass' } })
    fireEvent.change(inputs[1], { target: { value: 'ab' } })
    fireEvent.change(inputs[2], { target: { value: 'ab' } })

    await act(async () => {
      fireEvent.click(screen.getByText('Change Password'))
    })

    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('changes password successfully', async () => {
    authAPI.changePassword.mockResolvedValue({ data: { message: 'ok' } })

    render(<ProfileSettings {...mockProps} />)
    fireEvent.click(screen.getByText('Password'))

    const inputs = screen.getAllByDisplayValue('')
    fireEvent.change(inputs[0], { target: { value: 'oldpassword' } })
    fireEvent.change(inputs[1], { target: { value: 'newpassword' } })
    fireEvent.change(inputs[2], { target: { value: 'newpassword' } })

    await act(async () => {
      fireEvent.click(screen.getByText('Change Password'))
    })

    await waitFor(() => {
      expect(authAPI.changePassword).toHaveBeenCalledWith('oldpassword', 'newpassword')
      expect(screen.getByText('Password changed successfully')).toBeInTheDocument()
    })
  })

  it('shows error on password change failure', async () => {
    authAPI.changePassword.mockRejectedValue({
      response: { data: { detail: 'Current password is incorrect' } },
    })

    render(<ProfileSettings {...mockProps} />)
    fireEvent.click(screen.getByText('Password'))

    const inputs = screen.getAllByDisplayValue('')
    fireEvent.change(inputs[0], { target: { value: 'wrongpass' } })
    fireEvent.change(inputs[1], { target: { value: 'newpassword' } })
    fireEvent.change(inputs[2], { target: { value: 'newpassword' } })

    await act(async () => {
      fireEvent.click(screen.getByText('Change Password'))
    })

    await waitFor(() => {
      expect(screen.getByText('Current password is incorrect')).toBeInTheDocument()
    })
  })

  it('updates display name input', () => {
    render(<ProfileSettings {...mockProps} />)
    const nameInput = screen.getByDisplayValue('testuser')
    fireEvent.change(nameInput, { target: { value: 'newname' } })
    expect(screen.getByDisplayValue('newname')).toBeInTheDocument()
  })

  it('updates bio textarea', () => {
    render(<ProfileSettings {...mockProps} />)
    const bioInput = screen.getByDisplayValue('Hello world')
    fireEvent.change(bioInput, { target: { value: 'New bio text' } })
    expect(screen.getByDisplayValue('New bio text')).toBeInTheDocument()
    expect(screen.getByText('12/200')).toBeInTheDocument()
  })
})
