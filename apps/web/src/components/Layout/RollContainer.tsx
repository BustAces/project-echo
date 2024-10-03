import { Box, BoxProps } from '@kazama-defi/uikit'

const RollContainer: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box px={['16px', '100px']} mx="auto" maxWidth="100%" {...props}>
    {children}
  </Box>
)

export default RollContainer
