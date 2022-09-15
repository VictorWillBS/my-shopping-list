import {faker} from '@faker-js/faker'

export default function itemFactory (){
  const title = faker.commerce.productName();
  const url = faker.internet.url();
  const description= faker.commerce.productDescription();
  const amount = Number(faker.random.numeric())
  return {
    title,
    url,
    description,
    amount
  }
}