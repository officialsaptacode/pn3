import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Image
        src="/window.svg"
        alt="Logo"
        width={300}
        height={300}
      />
      <h1 className="text-6xl font-bold">Welcome to saptacode!</h1>
    </div>
  )
}

