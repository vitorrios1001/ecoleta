import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { ROUTES } from '../constants'

const Stack = createStackNavigator()

const Routes: React.FC = () => {
  const renderRoutes = (
    ROUTES.map((route) => (
      <Stack.Screen
        key={route.name}
        name={route.name}
        component={route.component}
      />
    ))
  )

  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: '#F0F0F5'
          }
        }}
      >
        {renderRoutes}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes
