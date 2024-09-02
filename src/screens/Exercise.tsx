import { useEffect, useState } from "react"
import { TouchableOpacity, ScrollView } from "react-native"
import { VStack, Icon, HStack, Heading, Text, Image, Box, Toast, ToastTitle, useToast } from "@gluestack-ui/themed"
import { ArrowLeft } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

import { AppNavigatorRoutesProps } from "@routes/app.routes"

import { api } from "@services/api"
import { AppError } from "@utils/AppError"
import { ExerciseDTO } from "@dtos/ExerciseDTO"

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionSvg from "@assets/repetitions.svg"

import { Button } from "@components/Button"

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()

  const route = useRoute()

  const { exerciseId } = route.params as RouteParamsProps

  function handleGoBack() {
    navigation.goBack()
  }

  async function fethExerciseDetails() {
    try {
      const response = await api.get(`/exercise/${exerciseId}`)
      console.log(response)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar detalhes do exercícios."

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" bgColor="$red500" mt="$10">
            <ToastTitle color="white">{title}</ToastTitle>
          </Toast>
        ),
      }) 
    } 
  }

  useEffect(() => {
    fethExerciseDetails()
  }, [exerciseId])

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack justifyContent="space-between" alignItems="center" mt="$4" mb="$8">
          <Heading color="$gray100" fontFamily="$heading" fontSize="$lg" flexShrink={1}>Puxada frontal</Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">Costas</Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <VStack p="$8">
          <Image source={{
            uri: "https://static.wixstatic.com/media/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp/v1/fill/w_350,h_375,al_c,q_80,enc_auto/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp"
          }} 
          alt="Exercícios"
          mb="$3"
          resizeMode="cover"
          rounded="$lg"
          w="$full"
          h="$80"
          />

          <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
            <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
              <HStack>
                <SeriesSvg />
                <Text color="$gray200" ml="$2">3 séries</Text>
              </HStack>

              <HStack>
                <RepetitionSvg />
                <Text color="$gray200" ml="$2">12 repetições</Text>
              </HStack>
            </HStack>

            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}