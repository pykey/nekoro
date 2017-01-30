export class RegisterForm {
  username: string;
  email: string;
  repeatEmail: string;
  password: string;
  repeatPassword: string;
}

export const mockRegisterForm = {
  username: 'nekoro',
  email: 'neko@neko.ro',
  repeatEmail: 'neko@neko.ro',
  password: 'nekoro',
  repeatPassword: 'nekoro'
} as RegisterForm;
