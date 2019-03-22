import * as nanoid from 'nanoid'
import faker from 'faker'

export function nn() {
  return {
    id: `id_${nanoid()}`,
    title: faker.name.lastName(),
    forest: [],
  }
}
