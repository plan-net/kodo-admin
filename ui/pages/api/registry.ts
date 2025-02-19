import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  registry_url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  res.status(200).json({registry_url: process.env.REGISTRY_URL})
}