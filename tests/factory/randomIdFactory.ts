import {faker} from '@faker-js/faker'

export default function randomIdFactory (){
  const id = Number(faker.random.numeric())
  return id
}