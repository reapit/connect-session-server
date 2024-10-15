export type DecodedToken<T> = {
  aud: string
} & T

export interface Session {
  access_token: string
  id_token: string
  refresh_token: string
  error?: string
}

export interface ReapitConnectServerSessionInitializers {
  connectOAuthUrl: string
  connectClientId: string
  connectClientSecret: string
}

export interface CoginitoAccess {
  sub: string
  'cognito:groups': string[]
  token_use: string
  scope: string
  auth_time: number
  iss: string
  exp: number
  iat: number
  version: number
  jti: string
  client_id: string
  username: string
}

export interface LoginIdentity {
  email: string
  name: string
  agencyCloudId: string | null
  developerId: string | null
  clientId: string | null
  adminId: string | null
  userCode: string | null
  groups: string[]
  orgName: string | null
  orgId: string | null
  offGroupIds: string | null
  offGrouping: boolean
  offGroupName: string | null
  officeId: string | null
  orgProduct: string | null
}

export interface Claim {
  token_use: string
  auth_time: number
  iss: string
  exp: number
  username: string
  client_id: string
}
