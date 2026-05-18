import AuthForm from '@/components/auth/AuthForm'
import GoogleButton from '@/components/auth/GoogleButton'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md rounded-3xl border border-yellow-700/20 bg-black/70 p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl text-yellow-100">
            Tạo tài khoản
          </h1>

          <p className="text-yellow-100/60">
            Tham gia vào Echoes
          </p>
        </div>

        <div className="space-y-4">
          <GoogleButton />

          <div className="relative py-2 text-center text-yellow-100/40">
            hoặc
          </div>

          <AuthForm mode="signup" />

          <div className="pt-4 text-center text-sm text-yellow-100/50">
            Đã có tài khoản?

            <Link
              href="/login"
              className="ml-2 text-yellow-300"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
