export interface UserBase {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  active: boolean,
  roles?: Role[],
  rights?: string[],
}

export interface NewUser extends Omit<UserBase,'id' | 'roles'> {
  password: string,
  roles?: string[]
}

export interface UserUpdate extends Omit<UserBase,'roles'> {
  password?: string,
  roles?: string[]
}

export interface Credentials {
  username: string,
  password: string,
}

export interface Token {
  firstName: string,
  lastName: string,
  username: string,
  token: string,
  roles?: string[],
  rights?: string[],
}

export interface Role {
  id: string;
  roleName: string;
  active: boolean;
  rights?: Right[];
}

export interface RoleUpdate extends Omit<Role,'rights'> {
  rights?: string[]
}

export interface NewRole extends Omit<RoleUpdate,'id'> {}

export interface Right {
  id: string;
  right: string;
  active: boolean;
  relatedModule: string;
}

export interface NewRight extends Omit<Right,'id'> {}

export interface FilterParamData {
  name: string;
  username: string;
  role: string;
  right: string;
  userActive: string;
  roleActive: string;
}