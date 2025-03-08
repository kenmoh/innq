import Analytics from '@/components/overview'
import React from 'react'
import { getCurrentUser } from '../actions/authActions'

const page = async () => {
    const user = await getCurrentUser()
    console.log(user)
    return (
        <Analytics />
    )
}

export default page