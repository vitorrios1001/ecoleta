import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'

import { ROUTE_NAMES } from '../../constants'
import api from '../../services/api'

interface Item {
  id: number;
  title: string;
  image: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface RouteParams {
  uf: string;
  city: string;
}

const Points: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const routeParams = route.params as RouteParams

  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  
  const [initialPos, setInitialPos] = useState<[number, number]>([0, 0])

  useEffect(() => {
    async function loadItems() {
      const { data } = await api.get('/items')

      setItems(data)
    }

    loadItems()
  }, [])

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert('Opss...', 'Precisamos da sua posição!')
        return
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      setInitialPos([latitude, longitude]) 
    }

    loadPosition()
  }, [])

  useEffect(() => {
    async function loadPoints() {
      try {
        const { data } = await api.get('/points', {
          params: {
            uf: routeParams.uf,
            city: routeParams.city,
            items: selectedItems
          }
        })

        setPoints(data)
      } catch (error) {
        Alert.alert('Opps', 'Aconteceu algum erro ao tentar buscar os pontos de coleta. Tente novamente mais tarde!')
        return
      }
    }

    loadPoints()
  }, [selectedItems])

  const goBackToHome = () => {
    navigation.goBack()
  }

  const handleNavigateDetail = (id: number) => {
    navigation.navigate(ROUTE_NAMES.detail, { point_id: id })
  }

  const handleSelectedItem = (id: number) => {
    const itemHasSelected = selectedItems.includes(id)

    const newListItems = itemHasSelected
      ? selectedItems.filter(item => item !== id) 
      : [...selectedItems, id]

    setSelectedItems(newListItems)
  }

  const renderItems = () => (
    items.map((item) => (
      <TouchableOpacity
        key={String(item.id)}
        style={[
          styles.item,
          selectedItems.includes(item.id) ? styles.selectedItem : {},
        ]}
        activeOpacity={0.6}
        onPress={() => handleSelectedItem(item.id)}
      >
        <SvgUri width={42} height={42} uri={item.image}/>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    ))
  )

  const renderMarkers = () => (
    points.map((point) => (
      <Marker
        key={String(point.id)}
        style={styles.mapMarker}
        onPress={() => handleNavigateDetail(point.id)}
        coordinate={{
          latitude: point.latitude,
          longitude: point.longitude,
        }}
      >
        <View style={styles.mapMarkerContainer}>
          <Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
          <Text style={styles.mapMarkerTitle}>{point.name}</Text>
        </View>
      </Marker>
    ))
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={goBackToHome} >
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

        <View style={styles.mapContainer} >
          {
            initialPos[0] !== 0 && (
              <MapView
                style={styles.map}
                loadingEnabled={initialPos[0] === 0}
                initialRegion={{
                  latitude: initialPos[0],
                  longitude: initialPos[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014,
                }}
              >
                {renderMarkers()}
              </MapView>
            )
          }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {renderItems()}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Points

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});
