import * as nanoid from 'nanoid'
import faker from 'faker'
import { dropLast, last } from 'ramda'

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

export function outdent(ancestors, tree) {
  const parent = last(ancestors)
  const grandParent = last(dropLast(1, ancestors))

  if (parent && grandParent) {
    const oldIdx = parent.forest.indexOf(tree)
    parent.forest.splice(oldIdx, 1)

    const newIdx = grandParent.forest.indexOf(parent) + 1

    grandParent.forest.splice(newIdx, 0, tree)
  }
}
