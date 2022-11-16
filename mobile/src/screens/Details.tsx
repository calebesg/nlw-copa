import { useEffect, useState } from 'react'
import { Share } from 'react-native'
import { HStack, useToast, VStack } from 'native-base'
import { useRoute } from '@react-navigation/native'

import { api } from '../services/api'

import { Header } from '../components/Header'
import { Option } from '../components/Option'
import { Loading } from '../components/Loading'
import { PoolPros } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader'
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'

interface RouteParams {
  id: string
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'GUESSES' | 'RANKING'>(
    'GUESSES'
  )
  const [isLoading, setIsLoading] = useState(true)
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros)

  const route = useRoute()
  const toast = useToast()
  const { id } = route.params as RouteParams

  async function fetchPoolDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${id}`)

      setPoolDetails(response.data.pool[0])
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão!',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePoolShare() {
    await Share.share({
      message: poolDetails.code,
    })
  }

  useEffect(() => {
    fetchPoolDetails()
  }, [id])

  if (isLoading) return <Loading />

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handlePoolShare}
      />

      {poolDetails._count.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus Palpites"
              isSelected={optionSelected === 'GUESSES'}
              onPress={() => setOptionSelected('GUESSES')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'RANKING'}
              onPress={() => setOptionSelected('RANKING')}
            />
          </HStack>
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  )
}
