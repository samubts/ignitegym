import { useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { Center, Heading, Text, VStack, useToast, Toast, ToastTitle } from "@gluestack-ui/themed"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import * as yup from "yup"

import { api, userService } from "@services/api"

import defaultUserPhotoImg from "@assets/userPhotoDefault.png"

import { AppError } from "@utils/AppError"
import { useAuth } from "@hooks/useAuth"

import { ToastMessage } from "@components/ToastMessage"
import { ScreenHeader } from "@components/ScreenHeader"
import { UserPhoto } from "@components/UserPhoto"
import { Button } from "@components/Button"
import { Input } from "@components/Input"

export type FormDataProps = {
  name: string,
  email?: string,
  password?: string | null | undefined,
  old_password?: string | null | undefined,
  confirm_password?: string | null | undefined,
}

const profileSchema = yup.object().shape({
  name: yup.string().required("Informe o nome."),
  password: yup.string().min(6, "A senha deve ter pelo menos 6 dígitos.").nullable().transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref("password"), null], "A confirmação de senha não confere")
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
      schema
      .required("Informe a confirmação da senha.")
      .nullable()
      .transform((value) => !!value ? value : null)
    })
})
export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)

  const toast = useToast()
  const { user, updadteUserProfile } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
  })

  async function handleProfileUpdade(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put("/users", data)

      await updadteUserProfile(userUpdated)

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" bgColor="$green500" mt="$7">
            <ToastTitle color="white">Perful atualizado com sucesso!</ToastTitle>
          </Toast>
        ),
      })
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível atualizar os dados. Tente novamente mais tarde."

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" bgColor="$red500" mt="$7">
            <ToastTitle color="white">{title}</ToastTitle>
          </Toast>
        ),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleUserPhotoSelect() {
    setIsUpdating(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI){
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            placement: "top",
            render: ({ id}) => (
              <ToastMessage 
                id={id} 
                action="error"
                title="Essa imagem é muito grande. Escolha uma de até 5MB." 
                onClose={() => toast.close(id)} 
              />
            )
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop()
        
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any
        
        const userPhotoUploadForm = new FormData()

        userPhotoUploadForm.append("avatar", photoFile)

        const avatarUpdatedResponse =
        await userService.updateImageProfile(userPhotoUploadForm)

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        await updadteUserProfile(userUpdated)

        console.log(userUpdated)

        toast.show({
          placement: "top",
          render: () => (
            <Toast action="error" bgColor="$green500" mt="$7">
              <ToastTitle color="white">Foto atualizada com sucesso!</ToastTitle>
            </Toast>
          ),
        })
      }
    } catch (error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar a foto. Tente novamente mais tarde."

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" bgColor="$red500" mt="$10">
            <ToastTitle color="white">{title}</ToastTitle>
          </Toast>
        ),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto 
            source={ 
            user.avatar 
            ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } 
            : defaultUserPhotoImg
          } 
            alt="Foto do usuário" size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="$green500" fontFamily="$heading" fontSize="$md" mt="$2" mb="$8">
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller 
              control={control} 
              name="name" 
              render={( { field: {value, onChange }} ) => (
                <Input 
                  placeholder="Nome" 
                  bg="$gray600" 
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )} 
            />

            <Controller 
              control={control} 
              name="email" 
              render={({ field: {value, onChange } }) => (
                <Input  
                  bg="$gray600" 
                  placeholder="E-mail"
                  isReadOnly 
                  onChangeText={onChange}
                  value={value}
                />
              )} 
            />
          </Center>

          <Heading 
            alignSelf="flex-start" 
            fontFamily="$heading" 
            color="$gray200" 
            fontSize="$md" 
            mt="$12" 
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller 
              control={control} 
              name="old_password" 
              render={({ field: { onChange } }) => (
                <Input 
                  placeholder="Senha antiga" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                />
              )} 
            />

            <Controller 
              control={control} 
              name="password" 
              render={({ field: { onChange } }) => (
                <Input 
                  placeholder="Nova senha" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )} 
            />

            <Controller 
              control={control} 
              name="confirm_password" 
              render={({ field: { onChange } }) => (
                <Input 
                  placeholder="Confirme a nova senha" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )} 
            />
            
            <Button 
              title="Atualizar" 
              onPress={handleSubmit(handleProfileUpdade)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}