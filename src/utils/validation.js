export const regex = {
  email:     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password:  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  phone:     /^\+\d{7,15}$/,
  username:  /^[A-Za-z][A-Za-z0-9 _]{2,}$/,
}

export const messages = {
  invalidEmail:      'Please enter a valid email.',
  invalidPassword:   'Password must be at least 8 characters, include uppercase, lowercase and a digit.',
  invalidPhone:      'Phone must start with + and contain 7–15 digits.',
  invalidUsername:   'Username must be ≥3 characters, start with a letter, and contain letters/numbers/_/space.',
  emptyField:        'This field cannot be empty.',
  emptyTitleBody:    'Both title and body must be non-empty.',
  invalidCredentials:'Invalid email or password.',
  signupFailed:      'Sign up failed. Please check your data.',
}
