import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'
import { withWebSecurityHeaders } from '@kazama-defi/next-config/withWebSecurityHeaders'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@kazama-defi/uikit',
    '@kazama-defi/hooks',
    '@kazama-defi/localization',
    '@kazama-defi/utils',
    '@0xsquid/widget',
  ],
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/aptos',
        destination: '/stargate',
        permanent: true,
      },
    ]
  }
}

export default withAxiom(withVanillaExtract(withWebSecurityHeaders(nextConfig)))
