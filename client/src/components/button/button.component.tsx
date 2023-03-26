import {
  ButtonDestructive, ButtonPrimaryL, ButtonPrimaryS, ButtonSecondary,
} from './button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle: string
  children?: React.ReactNode,
  width?: string,
  onClick?: () => void,
}

export const BUTTON_TYPES = {
  primaryL: 'primaryL',
  primaryS: 'primaryS',
  secondary: 'secondary',
  destructive: 'destructive',
};

const getButtonType = (type: string) => (
  {
    [BUTTON_TYPES.primaryL]: ButtonPrimaryL,
    [BUTTON_TYPES.primaryS]: ButtonPrimaryS,
    [BUTTON_TYPES.secondary]: ButtonSecondary,
    [BUTTON_TYPES.destructive]: ButtonDestructive,
  }[type]
);

function Button({
  buttonStyle,
  width,
  children,
  ...otherProps
}: ButtonProps) {
  const CustomButton = getButtonType(buttonStyle);

  return (
    <CustomButton style={{ width }} {...otherProps}>{children}</CustomButton>
  );
}

export default Button;
