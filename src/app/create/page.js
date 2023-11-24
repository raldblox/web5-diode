"use client"

import Container from '@/components/Container'
import SignIn from '@/components/forms/SignIn'
import { useEffect, useState } from 'react'

export default () => {


    return (
        <Container className="flex w-full items-center justify-center min-h-screen">
            <section className="w-full max-w-md">
                <SignIn />
            </section>
        </Container>
    )

}