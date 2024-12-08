import { router } from "expo-router"
import { Button } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const index = () => {
  return (
    <SafeAreaView>
        <Button title="Login" onPress={() => {router.push("/login")}} />
    </SafeAreaView>
  )
}

export default index