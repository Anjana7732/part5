const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ]

  const blogs = [
    { title: 'Blog A', author: 'Author1', likes: 7 },
    { title: 'Blog B', author: 'Author2', likes: 3 },
    { title: 'Blog C', author: 'Author1', likes: 12 },
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(22)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { title: 'Blog A', author: 'Author1', likes: 7 },
    { title: 'Blog B', author: 'Author2', likes: 3 },
    { title: 'Blog C', author: 'Author1', likes: 12 },
  ]

    test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({ title: 'Blog C', author: 'Author1', likes: 12 })
    })


  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
})
})

describe('most blogs', () => {
  const blogs = [
    { title: 'Blog A', author: 'Robert C. Martin', likes: 7 },
    { title: 'Blog B', author: 'Edsger W. Dijkstra', likes: 5 },
    { title: 'Blog C', author: 'Robert C. Martin', likes: 3 },
    { title: 'Blog D', author: 'Robert C. Martin', likes: 2 },
  ]

  test('finds the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(null)
  })
})


describe('most likes', () => {
  const blogs = [
    { title: 'Blog A', author: 'Edsger W. Dijkstra', likes: 7 },
    { title: 'Blog B', author: 'Robert C. Martin', likes: 5 },
    { title: 'Blog C', author: 'Edsger W. Dijkstra', likes: 10 },
  ]

  test('finds the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(null)
  })
})
