import { NextConfig } from 'next'

const config: NextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
}

export default config
