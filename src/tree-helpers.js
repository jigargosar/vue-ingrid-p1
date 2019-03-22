import * as nanoid from 'nanoid'
import faker from 'faker'

export function newNode() {
  return {
    id: `id_${nanoid()}`,
    title: faker.name.lastName(),
    collapsed: false,
    forest: [],
  }
}

export function createRoot() {
  const root = newNode()
  root.id = 'id_root'
  root.title = 'Root'
  root.forest.push(newNode())
  root.forest.push(newNode())
  root.forest.push(newNode())
  return root
}
