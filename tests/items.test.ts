import app from '../src/app'
import itemFactory from './factory/itemFactory'
import randomIdFactory from './factory/randomIdFactory'
import supertest from 'supertest'
import { prisma } from '../src/database'
beforeEach(async()=>{
  await prisma.$executeRaw`TRUNCATE TABLE "items"`;
})
describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto',async()=>{
    const itemData = itemFactory();
    const result = await supertest(app).post('/items').send(itemData);
    expect(result.status).toBe(201);
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async()=>{
    const itemData = itemFactory();
    await supertest(app).post('/items').send(itemData)
    const result = await supertest(app).post('/items').send(itemData);
    expect(result.status).toBe(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array',async()=>{
    const result = await supertest(app).get(`/items`).send();
    expect(result.status).toEqual(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado',async()=>{
    const itemData = itemFactory();
    await supertest(app).post('/items').send(itemData);
    const {id}=await prisma.items.findUnique({where:{title:itemData.title}});
    const result = await supertest(app).get(`/items/${id}`).send();
    const itemResult = result.body;
    delete itemResult.id;
    expect(result.status).toEqual(200);
    expect(itemResult).toEqual(itemData);
  });
  it('Deve retornar status 404 caso não exista um item com esse id',async()=>{
    const id = randomIdFactory()
    const result = await supertest(app).get(`/items/${id}`).send()
    expect(result.status).toBe(404)
  });
});
