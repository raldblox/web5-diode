import Container from '@/components/Container'
import SignIn from '@/components/forms/SignIn'
import React from 'react'

export default () => {
    // check if available

    //
    return (
        <Container classname="flex items-center justify-center min-h-screen">
            <div className='w-full max-w-md'>
                <SignIn />
            </div>
        </Container>
    )
}