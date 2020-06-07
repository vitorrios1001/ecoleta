import React, { useEffect, useState } from 'react'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'

import api from '../../services/api'
import { COLORS } from '../../constants'
import { Loader } from '../../components'

interface RouteParams {
  point_id: number;
}

interface Point {
  id: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items?: {
    title: string;
  }[]
}

const Detail: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Point>({} as Point)

  const routeParams = route.params as RouteParams

  useEffect(() => {
    async function loadPoint() {
      setLoading(true)
      const { data } = await api.get(`/points/${routeParams.point_id}`)

      setData({
        ...data.point,
        items: data.items,
      })
      setTimeout(() => {
        setLoading(false)
      }, 1500)
    }

    loadPoint()
  }, [])

  const goBackToHome = () => {
    navigation.goBack()
  }
  
  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.email]
    })
  }

  const handleComposeWhatsapp = () => {
    Linking.openURL(`whatsapp://send?phone=+55${data.whatsapp}&text=Tenho interesse em coleta de resíduos`)
  }

  if (loading) {
    return <Loader title="Carregando dados da entidade. Aguarde..." />
  }

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <View style={styles.container}>
        <TouchableOpacity onPress={goBackToHome} >
          <Icon name="arrow-left" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data.image }}   />

        <Text style={styles.pointName}>{data.name}</Text>
        <Text style={styles.pointItems}>Lampadas, Óleo de Cozinha</Text>

        <View style={styles.address} >
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.city}, {data.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleComposeWhatsapp}>
          <FontAwesome name="whatsapp" color="#FFF" size={20} />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" color="#FFF" size={20} />
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Detail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34cb79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

