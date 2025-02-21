import type { NextApiRequest, NextApiResponse } from 'next'
import { decode } from 'next-auth/jwt';
// import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react';
// import { headers } from 'next/headers'
import { URLSearchParams } from 'node:url'


type ResponseData = {
  access_token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const sessionToken = req.cookies['next-auth.session-token'];

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET as string,
  });
  const audience = req.query.audience as string

  if (!decoded) {
    res.status(401).json({ access_token: '' })
    return
  }

  // fetch an access token from keycloak
  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', (decoded as any).refreshToken)
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID)
  params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET)
  params.append('audience', audience)
  const response = await fetch(process.env.KEYCLOAK_ISSUER + '/protocol/openid-connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })
  const data = await response.json()
  if (response.status !== 200) {  
    res.status(502).json({ access_token: '' })
    console.warn(data)
    return
  }
  res.status(200).json({access_token: data.access_token})
}