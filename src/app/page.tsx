import Heading from "./components/Heading"
import MaxWidthWrapper from "./components/MaxWidthWrapper"

const page = () => {
    return (
        <>
            <section className="relative py-24 sm:py-32 bg-brand-25 ">
                <MaxWidthWrapper className="text-center">
                    <div className="relative mx-auto text-center flex flex-col items-center gap-10">
                        <div>
                            <Heading className="text-sm">
                                Real-Time Saas Insights,
                            </Heading>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </section>
            <section></section>
            <section></section>
            <section></section>
        </>
    )
}
export default page
