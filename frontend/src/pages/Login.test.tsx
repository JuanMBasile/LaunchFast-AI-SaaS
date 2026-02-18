import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import Login from './Login';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();
const mockT = vi.fn((key: string) => key);

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderLogin() {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </HelmetProvider>,
  );
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/auth\.login\.email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auth\.login\.submit/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /auth\.login\.submit/i }));
    expect(mockLogin).not.toHaveBeenCalled();
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Email required')).toBeInTheDocument();
  });

  it('calls login with email and password when form is valid', async () => {
    mockLogin.mockResolvedValue(undefined);
    renderLogin();
    await userEvent.type(screen.getByLabelText(/auth\.login\.email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /auth\.login\.submit/i }));
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
