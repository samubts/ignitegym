import { useState, useEffect, useCallback } from "react"
import { FlatList } from "react-native" 
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { HStack, VStack, Heading, Text, useToast, Toast, ToastTitle } from "@gluestack-ui/themed"

import { api } from "@services/api"
import { AppError } from "@utils/AppError"
import { ExerciseDTO } from "@dtos/ExerciseDTO"

import { AppNavigatorRoutesProps } from "@routes/app.routes"

import { ExerciseCard } from "@components/ExerciseCard"
import { HomeHeader } from "@components/HomeHeader"
import { Group } from "@components/Group"

export function Home() {
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState("Costas")

  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExercisesDetails(){
    navigation.navigate("exercise")
  }

  async function fetchGroups() {
    try {
      const reponse = await api.get("/groups")
      setGroups(reponse.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar os grupos musculares."

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

  async function fechExercisesByGroup() {
    try {
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)
      
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
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
    fechExercisesByGroup()
  }, [groupSelected]))

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups} 
        keyExtractor={(item) => item} 
        renderItem={({ item }) => ( 
          <Group 
            name={item} 
            isActive={groupSelected.toLowerCase() === item.toLowerCase()} 
            onPress={() => setGroupSelected(item)} 
          />
        )} 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44}}
      />

      <VStack px="$8" flex={1}>
        <HStack justifyContent="space-between" mb="$5" alignItems="center">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Heading>

          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList 
          data={exercises} 
          keyExtractor={item => item.id} 
          renderItem={() => 
            <ExerciseCard 
              onPress={handleOpenExercisesDetails} 
              data={item} 
            />
          } 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        />

      </VStack>

    </VStack>
  )
}