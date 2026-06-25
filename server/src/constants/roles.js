const ROLES = {
  ADMIN: 'admin',
  VOLUNTEER: 'volunteer',
  DONOR: 'donor',
};

const ROLE_LIST = Object.values(ROLES);

const PUBLIC_REGISTER_ROLES = [ROLES.VOLUNTEER, ROLES.DONOR];

const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.VOLUNTEER]: 'Volunteer',
  [ROLES.DONOR]: 'Donor',
};

module.exports = {
  ROLES,
  ROLE_LIST,
  PUBLIC_REGISTER_ROLES,
  ROLE_LABELS,
};
