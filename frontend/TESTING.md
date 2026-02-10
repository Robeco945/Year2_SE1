# Jest Testing Guide


## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Files Created

1. Tests for main App component
   - Rendering tests
   - API loading tests
   - Error handling tests

2. Tests for ConversationList component  
   - Display tests
   - Interaction tests
   - Click handler tests




### Example Test
```javascript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Mock API Calls

```javascript
jest.mock('./services/api', () => ({
  messageAPI: {
    getConversations: jest.fn(),
  },
}))

messageAPI.getConversations.mockResolvedValue({ data: [] })
```

## Coverage Reports

After running `npm run test:coverage`, check:
- Terminal for coverage summary
- `coverage/` folder for detailed HTML reports

## Dependencies Installed

- jest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event
- jest-environment-jsdom
- @babel/preset-react
- @babel/preset-env
- identity-obj-proxy

