import Container from '@/components/Container'
import SignIn from '@/components/forms/SignIn'

export default () => {
    return (
        <Container classname="flex w-full items-center justify-center min-h-screen">
            <section className="w-full max-w-md">
                <SignIn />
            </section>
        </Container>
    )

}