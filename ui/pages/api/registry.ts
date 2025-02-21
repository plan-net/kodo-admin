import type { NextApiRequest, NextApiResponse } from 'next'
import type { RegistrySettings } from '@/lib/types'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RegistrySettings>
) {
    const reg_url = process.env.REGISTRY_URL || "http://localhost:5000"
    const reg_aud = process.env.REGISTRY_AUDIENCE || reg_url
    res.status(200).json({ registry_url: reg_url, registry_audience: reg_aud })
}

export const dynamic = "force-dynamic";
