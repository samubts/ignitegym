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
import { Loading } from "@components/Loading"

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar os detalhes do exercício."

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" bgColor="$red500" mt="$10">
            <ToastTitle color="white">{title}</ToastTitle>
          </Toast>
        ),
      }) 
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExercisesHistoryRegister() {
    try {
      setSendingRegister(true)

      await api.post("/history", { exercise_id: exerciseId })

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" bgColor="$green700" mt="$10">
            <ToastTitle 
              color="white"
            >
              Parabéns, Exercício registrado no seu histórico
            </ToastTitle>
          </Toast>
        ),
      }) 

      navigation.navigate("history")
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar os exercícios."

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" bgColor="$red500" mt="$10">
            <ToastTitle color="white">{title}</ToastTitle>
          </Toast>
        ),
      }) 
    } finally {
      setSendingRegister(false)
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
          <Heading 
            color="$gray100" 
            fontFamily="$heading" 
            fontSize="$lg" 
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text 
              color="$gray200" 
              ml="$1" 
              textTransform="capitalize"
            >
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      { isLoading ? <Loading /> :
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <VStack p="$8">
            <Box rounded="$lg" mb="$3" overflow="hidden">
              <Image source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
              }} 
                alt="Exercícios"
                resizeMode="cover"
                w="$full"
                h="$80"
              />
            </Box>

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                <HStack>
                  <SeriesSvg />
                  <Text 
                    color="$gray200" 
                    ml="$2"
                  >
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionSvg />
                  <Text 
                    color="$gray200" 
                    ml="$2"
                  >
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button 
                title="Marcar como realizado" 
                isLoading={sendingRegister} 
                onPress={handleExercisesHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      }
    </VStack>
  )
}