import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const EmptyComponent = () => {
    return (
        <View style={{ flex: 1, alignSelf: "center" }}>
            <LottieView
                source={require('@/assets/animations/empty.json')}
                autoPlay
                loop
                style={{ width: 300, height: 300,marginTop:45}}
            />
            <Text style={{ flex: 1, alignSelf: "center" }} >Kitaplığın boş görünüyor...</Text>
        </View>
    )
}

export default EmptyComponent
