import { InvalidTokenError } from 'jwt-decode'
import { verifyIdToken } from './verify-id-token'

const VALID_ID_TOKEN = 'VALID_ID_TOKEN'
const INVALID_ID_TOKEN = 'INVALID_ID_TOKEN'
const ACCES_TOKEN = 'ACCESS_TOKEN'

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn((token) => {
    switch (token) {
      case VALID_ID_TOKEN:
        return {
          token_use: 'id',
          iss: 'test-iss.reapit.cloud',
          audience: ['test-iss.reapit.cloud'],
        }
      case INVALID_ID_TOKEN:
        throw new InvalidTokenError()
      case ACCES_TOKEN:
        return {
          token_use: 'access',
          iss: 'test-iss.reapit.cloud',
          audience: ['test-iss.reapit.cloud'],
        }
    }
  }),
}))

jest.mock('idtoken-verifier', () => ({
  default: class {
    async verify(token: string, callback) {
      switch (token) {
        case VALID_ID_TOKEN:
          callback(null, {
            token_use: 'id',
            iss: 'test-iss.reapit.cloud',
            audience: ['test-iss.reapit.cloud'],
          })
          break
        case INVALID_ID_TOKEN:
          callback(null, {})
          break
        case ACCES_TOKEN:
          callback(null, {
            token_use: 'access',
            iss: 'test-iss.reapit.cloud',
            audience: ['test-iss.reapit.cloud'],
            name: '',
            email: '',
            'custom:reapit:agencyCloudId': '',
            'custom:reapit:developerId': '',
            'custom:reapit:clientCode': '',
            'custom:reapit:marketAdmin': '',
            'custom:reapit:userCode': '',
            'cognito:group': '',
            'custom:reapit:orgName': '',
            'custom:reapit:orgId': '',
            'custom:reapit:offGroupIds': '',
            'custom:reapit:offGrouping': '',
            'custom:reapit:offGroupName': '',
            'custom:reapit:officeId': '',
            'custom:reapit:orgProduct': '',
          })
          break
      }
    }
  },
}))

describe('verifyToken', () => {
  it('Can verify token', async () => {
    const loginIdentity = await verifyIdToken('VALID_ID_TOKEN')

    expect(loginIdentity).toHaveProperty('name')
    expect(loginIdentity).toHaveProperty('email')
    expect(loginIdentity).toHaveProperty('agencyCloudId')
    expect(loginIdentity).toHaveProperty('developerId')
    expect(loginIdentity).toHaveProperty('userCode')
    expect(loginIdentity).toHaveProperty('orgId')
    expect(loginIdentity).toHaveProperty('orgName')
  })
})
