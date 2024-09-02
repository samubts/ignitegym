import { useCallback, useState } from "react"
import { SectionList } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { Heading, Text, VStack, Toast, ToastTitle, useToast } from "@gluestack-ui/themed"

import { api } from "@services/api"
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO"

import { ScreenHeader } from "@components/ScreenHeader"
import { HistoryCard } from "@components/HistoryCard"
import { AppError } from "@utils/AppError"

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  const [exercises, useExercises] = useState<HistoryByDayDTO[]>([])

  async function fetchHistory() {
    try {
      setIsLoading(true)
      const response = await api.get("/history")
      useExercises(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar o histórico."

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

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      <SectionList 
        sections={exercises} 
        keyExtractor={item => item.id} 
        renderItem={({item}) => (
          <HistoryCard data={item} />
        )}
        renderSectionHeader={({ section }) => (
        <Heading 
          color="$gray200" 
          fontSize="$md" 
          mt="$10" 
          mb="$3" 
          fontFamily="$heading"
        >
          {section.title}
        </Heading>
      )} 
      style={{ paddingHorizontal: 32 }}
      contentContainerStyle={
        exercises.length === 0 && { flex: 1, justifyContent: "center" }
      }
      ListEmptyComponent={() => (
        <Text color="$gray100" textAlign="center">
          Não há exercícios registrados ainda. {"\n"} 
          Vamos fazer exercícios hoje?
        </Text>
      )}
      showsVerticalScrollIndicator={false}
      />
      
    </VStack>
  )
}