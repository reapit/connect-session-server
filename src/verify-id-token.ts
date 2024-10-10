import IdTokenVerifier from 'idtoken-verifier';
import { jwtDecode } from 'jwt-decode';
import { Claim, DecodedToken, LoginIdentity } from './types';

/**
 * This method will verify the incoming token, check whether the token is expired and return the login identity if valid
 *
 * @param token IdToken from client
 * @returns LoginIdentity
 */
export const verifyIdToken = async (
  token: string,
): Promise<LoginIdentity | undefined> => {
  try {
    const decodedToken = jwtDecode<DecodedToken<any>>(token)
    const aud: string | string[] = decodedToken.aud

    const verifier = new IdTokenVerifier({
      issuer: decodedToken.iss,
      audience: Array.isArray(aud) ? aud[0] : aud,
      leeway: 300,
    })

    const claim = (await new Promise<Claim>((resolve, reject) =>
      verifier.verify(token, (err: Error | null, payload: object | null) => {
        if (err) {
          reject(err)
        }
        resolve(payload as Claim)
      }),
    )) as Claim

    if (claim.token_use !== 'id')
      throw new Error('Id verification claim is not an id token');

    return {
      name: claim['name'],
      email: claim['email'],
      agencyCloudId: claim['custom:reapit:agencyCloudId'] || null,
      developerId: claim['custom:reapit:developerId'] || null,
      clientId: claim['custom:reapit:clientCode'] || null,
      adminId: claim['custom:reapit:marketAdmin'] || null,
      userCode: claim['custom:reapit:userCode'] || null,
      groups: claim['cognito:groups'] || [],
      orgName: claim['custom:reapit:orgName'] || null,
      orgId: claim['custom:reapit:orgId'] || null,
      offGroupIds: claim['custom:reapit:offGroupIds'] || null,
      offGrouping:
        claim['custom:reapit:offGrouping'] &&
        claim['custom:reapit:offGrouping'] === 'true'
          ? true
          : false,
      offGroupName: claim['custom:reapit:offGroupName'] || null,
      officeId: claim['custom:reapit:officeId'] || null,
      orgProduct: claim['custom:reapit:orgProduct'] || null,
    }
  } catch (error) {
    console.error('Reapit Connect Session error:', (error as any).message)
  }
}
