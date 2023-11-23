import Container from '@/components/Container'
import Dashboard from '@/components/utils/Dashboard'
import React from 'react'

export default () => {
    return (
        <Container classname="flex w-full items-center justify-center min-h-screen">
            <section className="w-full max-w-xl">
                <Dashboard />
            </section>
        </Container>
    )
}