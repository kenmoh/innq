'use client'

import React from 'react'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { logoutUser } from '@/app/actions/authActions'

const Logout = () => {
    return (
        <Button variant={'secondary'} type="submit"
            onClick={() => logoutUser()}
        >
            <LogOut />
            Logout
        </Button>
    )
}

export default Logout