export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginPresentationProps {
  onSignIn: (data: LoginFormData) => void;
  onRegister: (data: LoginFormData, projectName: string) => void;
  loading: boolean;
}

export const formDefaultValues: LoginFormData = {
  email: '',
  password: '',
};

export const formValidationRules = {
  email: {
    required: 'Email is required',
  },
  password: {
    required: 'Password is required',
  },
};
