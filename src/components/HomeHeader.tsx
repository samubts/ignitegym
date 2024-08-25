import { Heading, HStack, VStack, Text, Icon } from "@gluestack-ui/themed"
import { LogOut } from "lucide-react-native"

import { UserPhoto } from "./UserPhoto"

export function HomeHeader() {
  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
        <UserPhoto source={{uri: "https://github.com/samubts.png"}} alt="Imagem do usuário" w="$16" h="$16" />
        
        <VStack flex={1}>
            <Text color="$gray100" fontSize="$sm">Ola,</Text>

            <Heading color="$gray100" fontSize="$sm">Samuel Batista</Heading>
        </VStack>

        <Icon as={LogOut} color="$gray200" size="xl" />
    </HStack>
  )
}