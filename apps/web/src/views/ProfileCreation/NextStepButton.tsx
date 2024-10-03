import { ArrowForwardIcon, Button, ButtonProps } from '@kazama-defi/uikit'

const NextStepButton: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
  return <Button endIcon={<ArrowForwardIcon color="currentColor" />} {...props} />
}

export default NextStepButton
