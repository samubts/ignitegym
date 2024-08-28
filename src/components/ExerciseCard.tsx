import { Heading, HStack, Icon, Image, Text, VStack } from "@gluestack-ui/themed"
import { TouchableOpacity, TouchableOpacityProps  } from "react-native"
import { ChevronRight } from "lucide-react-native"

import { ExerciseDTO } from "@dtos/ExerciseDTO"

type Props = TouchableOpacityProps & {
  data: ExerciseDTO
}

export function ExerciseCard({ data, ...rest} : Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack bg="$gray500" alignItems="center" p="$2" pr="$4" rounded="$md" mb="$3">
        <Image 
          source={{
          uri: "https://static.wixstatic.com/media/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp/v1/fill/w_350,h_375,al_c,q_80,enc_auto/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp"}} 
          alt="Imagem do exercicio" 
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading 
            fontSize="$lg" 
            color="$white" 
            fontFamily="$heading"
          >
            {data.name}
          </Heading>

          <Text 
            fontSize="$sm" 
            color="$gray200" 
            mt="$1" 
            numberOfLines={2}
          >
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  )
}