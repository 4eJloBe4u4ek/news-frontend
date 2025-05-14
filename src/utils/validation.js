export const usernameRe = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9 _]{2,}$/
export const emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
export const phoneRe    = /^\+\d{7,15}$/

export const errorMessages = {
  username: 'Username must be at least 3 characters, start with a letter, and contain only letters, numbers, spaces or underscores.',
  email:    'Email must be a valid address (e.g. user@example.com).',
  password: 'Password must be at least 8 characters, with uppercase, lowercase and a number.',
  phone:    'Phone is optional, but if provided must start with “+” and be 7–15 digits.'
}
