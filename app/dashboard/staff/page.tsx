
import { getCompanyUserRoles, getCompanyUserDeparments } from '@/app/actions/authActions'
import StaffPage from '@/components/Staff'
import React from 'react'

const page = async () => {
    const roles = await getCompanyUserRoles()
    const { departments } = await getCompanyUserDeparments()

    return (
        <div><StaffPage roles={roles.roles || []} departments={departments || []} /> </div>
    )
}

export default page