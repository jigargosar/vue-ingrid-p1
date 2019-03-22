import * as nanoid from 'nanoid'
import faker from 'faker'
import { last } from 'ramda'

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

export function indent(ancestors, tree) {
  const parent = last(ancestors)
  if (parent) {
    const idx = parent.forest.indexOf(tree)
    const prevSib = parent.forest[idx - 1]
    if (prevSib) {
      parent.forest.splice(idx, 1)
      prevSib.forest.push(tree)
    }
  }
}
