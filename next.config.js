/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    
    //Policies
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: "nosniff"
                    },
                ]
            }
        ]
    }
}

module.exports = nextConfig
