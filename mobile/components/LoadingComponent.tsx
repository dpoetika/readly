import { View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const LoadingComponent = () => {
    return (
        <View style={{ flex: 1, alignSelf: "center" ,justifyContent:"center"}}>
            <LottieView
                source={require('@/assets/animations/openbook.json')}
                autoPlay
                loop
                style={{ width: 300, height: 300,marginTop:45}}
            />
        </View>
    )
}

export default LoadingComponent
