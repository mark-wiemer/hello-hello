import { before, after, describe, it } from 'mocha'

describe('cascade', () => {
  let resource

  before(() => {
    throw new Error('the real error')
  })

  after(() => {
    return resource.close()
  })

  it('runs after setup', () => {})
})