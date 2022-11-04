import { Center, Icon } from 'native-base'
import { Fontisto } from '@expo/vector-icons'

import { Button } from '../components/Button'

import Logo from '../assets/logo.svg'

export function SignIn() {
  return (
    <Center flex={1} bgColor="gray.900">
      <Logo width={212} height={40} />

      <Button
        title="entrar com google"
        type="SECONDARY"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
      />
    </Center>
  )
}
