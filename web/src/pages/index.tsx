import { GetStaticProps } from 'next'
import { FormEvent, useState } from 'react'
import Image from 'next/image'

import { api } from '../lib/axios'

import logoImg from '../assets/logo.svg'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import userAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert(
        'Bolão criado com sucesso, o código foi copidado para área de transferência!'
      )

      setPoolTitle('')
    } catch (err) {
      console.error(err)
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 text-sm px-6 py-4 text-gray-100 bg-gray-800 border border-gray-600 rounded"
            type="text"
            placeholder="Qual nome do seu bolão?"
            value={poolTitle}
            onChange={e => setPoolTitle(e.target.value)}
          />
          <button
            className="px-6 py-4 bg-yellow-500 rounded text-gray-900 text-sm font-bold uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex-1 flex items-center gap-6 border-r border-gray-600">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW copa"
        quality={100}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api('/pools/count'),
      api('/guesses/count'),
      api('/users/count'),
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60 * 10,
  }
}