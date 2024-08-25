import { Controller, useForm } from "react-hook-form"
import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"

import { AuthNavigatorRoutesProps } from "@routes/auth.routes"

import { useAuth } from "@hooks/useAuth"

import BackgroudImg from "@assets/background.png"
import Logo from "@assets/logo.svg"

import { Input } from "@components/Input"
import { Button } from "@components/Button"

type FormData = {
  email: string
  password: string
}

export function SignIn() {

  const { setUser } = useAuth()  

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({})

  function handleNewAccount() {
    navigation.navigate("signUp")
  }

  function handleSignIn({ email, password }: FormData) {
   
    setUser({
      id: "",
      name: "",
      email,
      avatar: ""
    })
  }
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} showsHorizontalScrollIndicator={false}>
            <VStack flex={1}>
                <Image 
                    w="$full" 
                    h={624}
                    source={BackgroudImg} 
                    defaultSource={BackgroudImg}
                    alt="Pessoas treinando"
                    position="absolute" 
                />

                <VStack flex={1} px="$10" pb="$16">
                    <Center my="$24">
                        <Logo />

                        <Text color="$gray100" fontSize="$sm">
                            Treine sua mente e o seu corpo.
                        </Text>
                    </Center>

                    <Center gap="$2">
                        <Heading color="$gray100"> Acesse a conta </Heading>

                        <Controller
                          control={control}
                          name="email"
                          rules={{ required: "Informe o e-mail" }}
                          render={({ field: { onChange, value } }) => (
                            <Input 
                              placeholder="E-mail" 
                              keyboardType="email-address" 
                              autoCapitalize="none"
                              onChange={onChange}
                              errorMessage={errors.email?.message}
                              value={value}
                            />
                          )} 
                        />

                        <Controller
                          control={control}
                          name="password"
                          rules={{ required: "Informe a senha" }}
                          render={({ field: { onChange, value } }) => (
                            <Input 
                              placeholder="Senha" 
                              secureTextEntry 
                              onChange={onChange}
                              errorMessage={errors.password?.message}
                              onSubmitEditing={handleSubmit(handleSignIn)}
                              returnKeyType="send"
                              value={value}
                            />
                          )} 
                        />

                        <Button 
                          title="Acessar" 
                          onPress={handleSubmit(handleSignIn)}
                        />
                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
                        Ainda não tem acesso?
                        </Text>

                        <Button title="Criar conta" variant="outline" onPress={handleNewAccount} />
                    </Center>
                </VStack>
            </VStack>
    </ScrollView>
  );
}