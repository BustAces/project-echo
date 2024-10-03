import bundleAnalyzer from '@next/bundle-analyzer'
import { withAxiom } from 'next-axiom'

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withWebSecurityHeaders } from '@kazama-defi/next-config/withWebSecurityHeaders'

const withVanillaExtract = createVanillaExtractPlugin()
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: [
    '@kazama-defi/localization',
    '@kazama-defi/hooks',
    '@kazama-defi/utils',
    '@kazama-defi/tokens',
    '@kazama-defi/farms',
    '@kazama-defi/widgets-internal',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: false,
      },
    ]
  },
}

export default withBundleAnalyzer(withVanillaExtract(withAxiom(withWebSecurityHeaders(nextConfig))))
