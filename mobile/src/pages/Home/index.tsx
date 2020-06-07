import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import PickeSelect from 'react-native-picker-select'

import ibge from '../../services/ibge'
import { ROUTE_NAMES } from '../../constants';

interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface City {
  id: number;
  nome: string;
}

interface Option {
  label: string;
  value: string;
}

interface Form {
  uf: string;
  city: string;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])

  const [form, setForm] = useState<Form>({} as Form)

  useEffect(() => {
    async function loadUfs() {
      const { data } = await ibge.get('/')

      const options = data.map((uf: UF) => ({
        label: `${uf.sigla} - ${uf.nome}`,
        value: uf.sigla,
      }))

      setUfs(options)
    }

    loadUfs()
  }, [])

  useEffect(() => {
    async function loadCities() {
      const hasUfSelected = Boolean(form.uf)

      if (!hasUfSelected) {
        return
      }

      const { data } = await ibge.get(`/${form.uf}/municipios`)

      const cityOptions = data.map((city: City) => ({
        label: city.nome,
        value: city.nome,
      }))

      setCities(cityOptions)
    }

    loadCities()
  }, [form.uf])

  const navigation = useNavigation()

  const handleNavigateToPoints = () => {
    navigation.navigate(ROUTE_NAMES.points, { ...form })
  }

  const handleSelect = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title} >
          Seu marketplace de coleta de resíduos
        </Text>
        <Text style={styles.description} >
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.select}>
          <PickeSelect
            items={ufs}
            onValueChange={(value) => handleSelect('uf', value)}
            placeholder={{
              label: 'Selecione sua UF'
            }}
          />
        </View>

        <View style={styles.select}>
          <PickeSelect
            items={cities}
            onValueChange={(value) => handleSelect('city', value)}
            placeholder={{
              label: 'Selecione sua Cidade'
            }}
          />
        </View>

        <RectButton
          style={styles.button}
          onPress={handleNavigateToPoints}
          enabled={Boolean(form.city)}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;