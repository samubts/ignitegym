import { TouchableOpacity } from "react-native"
import { Heading, HStack, VStack, Text, Icon } from "@gluestack-ui/themed"
import { LogOut } from "lucide-react-native"

import { api } from "@services/api"

import { useAuth } from "@hooks/useAuth"

import defaultUserPhotoImg from "@assets/userPhotoDefault.png"

import { UserPhoto } from "./UserPhoto"

export function HomeHeader() {
  const { user, signOut } = useAuth() 

  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto source={ 
        user.avatar 
        ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } 
        : defaultUserPhotoImg} 
        alt="Imagem do usuário" 
        w="$16" 
        h="$16" 
      />
      
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">Ola,</Text>

        <Heading color="$gray100" fontSize="$sm">{user.name}</Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={LogOut} color="$gray200" size="xl" />
      </TouchableOpacity>
    </HStack>
  )
}