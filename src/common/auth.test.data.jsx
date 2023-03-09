export const MOCK_LOGGED_IN_USER = {
  expired: false,
  id_token: 'id_token',
  session_state: 'session_state',
  access_token: 'access_token',
  refresh_token: undefined,
  token_type: 'Bearer',
  scope: 'openid profile test_scope',
  profile: {
    sub: 'test@visionplanner.com',
    auth_time: Date.now(),

  },
  expires_at: Date.now() + 10000,
  state: undefined,
};

export const MOCK_USER_PROFILE = {
  userId: '0C8263F5-4B52-4ABD-B83F-B5D3CF216DF5',
  organisationIds: [
    '0C8263F5-4B52-4ABD-B83F-B5D3CF216DF5',
  ],
};
