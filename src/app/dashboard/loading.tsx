import LoadingSpinner from "@/components/LoadingSpinner"

const loading = () => {
    return (
        <div className="flex items-center justify-center h-[90vh]">
            <LoadingSpinner size={"md"} />
        </div>
    )
}
export default loading
