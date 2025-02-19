import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    registry_url: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const reg_url = process.env.REGISTRY_URL || "http://localhost:5000"
    res.status(200).json({ registry_url: reg_url})
}

export const dynamic = "force-dynamic";
