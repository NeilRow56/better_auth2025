import { createAccessControl } from 'better-auth/plugins/access'
import {
  defaultStatements,
  userAc,
  adminAc
} from 'better-auth/plugins/admin/access'

export const ac = createAccessControl(defaultStatements)

export const user = ac.newRole({
  ...userAc.statements,
  // adding the ability to a user to view list of users - THIS IS FOR DEMO ONLY
  user: [...userAc.statements.user, 'list']
})

export const admin = ac.newRole(adminAc.statements)
