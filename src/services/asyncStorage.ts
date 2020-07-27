import AsyncStorage from '@react-native-community/async-storage'

export async function set(key: string, value: any) {
  await AsyncStorage.setItem(key, '' + value)
}

export async function get(key: string, defaultValue?: string): Promise<string | boolean | undefined> {
  const value = await AsyncStorage.getItem(key)

  if (value === 'true' || value === 'false') {
    return value === 'true'
  }

  return value !== null ? value : defaultValue
}

export async function remove(key: string) {
  await AsyncStorage.removeItem(key)
}

const storage = {
  set,
  get,
  remove,
}

export default storage
