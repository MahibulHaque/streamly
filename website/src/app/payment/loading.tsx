import { Spinner } from '@/components/common/loader/spinner'

const Loading = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Spinner />
    </div>
  )
}

export default Loading