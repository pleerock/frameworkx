import { ModelSelection } from "@microframework/core"

describe("core > hub > selection", () => {
  describe("ModelSelection (simple case)", () => {
    type User = {
      id: number
      firstName: string
      lastName: string
      age: number
    }

    type Album = {
      id: number
      name: string
    }

    type Photo = {
      id: number
      filename: string
      author: User
      albums: Album[]
    }

    test("must select a proper subset of a model", () => {
      const selection: ModelSelection<
        User,
        {
          id: true
          firstName: true
        }
      > = {
        id: 1,
        firstName: "Timber",
      }
      selection.id
      selection.firstName
      // @ts-expect-error
      selection.lastName
    })

    test("must select a proper subset of a nested model", () => {
      const selection: ModelSelection<
        Photo,
        {
          id: true
          author: {
            firstName: true
            lastName: true
          }
          albums: {
            name: true
          }
        }
      > = {
        id: 1,
        author: {
          firstName: "Timber",
          lastName: "Saw",
        },
        albums: [{ name: "Me" }, { name: "Cats" }],
      }
      selection.id
      selection.author.firstName
      selection.author.lastName
      // @ts-expect-error
      selection.filename
      // @ts-expect-error
      selection.author.id
      selection.albums[0].name
      selection.albums[1].name
      // @ts-expect-error
      selection.albums[0].id
      // @ts-expect-error
      selection.albums[1].id
    })

    test("must not allow to assign a value for the property that doesn't exist in the selection", () => {
      const selection1: ModelSelection<
        User,
        {
          id: true
          firstName: true
        }
      > = {
        id: 1,
        // must give an error because lastName property wasn't selected
        // @ts-expect-error
        lastName: "Timber",
      }
      const selection2: ModelSelection<
        Photo,
        {
          id: true
          author: {
            id: true
            lastName: true
          }
        }
      > = {
        id: 1,
        // must give an error because id property wasn't defined
        // @ts-expect-error
        author: {
          lastName: "Saw",
        },
      }
      const selection3: ModelSelection<
        Photo,
        {
          id: true
          author: {
            lastName: true
          }
        }
      > = {
        id: 1,
        author: {
          // must give an error because firstName property wasn't selected
          // @ts-expect-error
          firstName: "Timber",
          lastName: "Saw",
        },
      }
      const selection4: ModelSelection<
        Photo,
        {
          id: true
          albums: {
            name: true
          }
        }
      > = {
        id: 1,
        albums: {
          // must give an error because array is expected
          // @ts-expect-error
          name: "Cats",
        },
      }
      const selection5: ModelSelection<
        Photo,
        {
          id: true
          albums: {
            name: true
          }
        }
      > = {
        id: 1,
        albums: [
          {
            // must give an error because id isn't selected at all
            // @ts-expect-error
            id: "Cats",
          },
        ],
      }
      const selection6: ModelSelection<
        Photo,
        {
          id: true
          albums: {
            name: true
          }
        }
      > = {
        id: 1,
        albums: [
          {
            // must give an error because name is a type of string
            // @ts-expect-error
            name: 123,
          },
        ],
      }
      const selection7: ModelSelection<
        Photo,
        // must give an error because there is no "id2" property in the Photo model
        // @ts-expect-error
        {
          id2: true
        }
      > = {}
      // must give an error because id wasn't set in the value
      // @ts-expect-error
      const selection8: ModelSelection<
        Photo,
        {
          id: true
        }
      > = {}
    })

    describe("ModelSelection (complex case with union types)", () => {
      type Album = {
        id: number
        name: string
      }

      type Photo = {
        id: number
        filename: string
      }

      type User = {
        id: number
        firstName: string | null
        lastName: string | undefined
        albums: Album[] | null
        photos: Photo[] | undefined
        photoOrAlbum: Album | Photo
      }

      test("must select a proper subset of a model", () => {
        const selection1: ModelSelection<
          User,
          {
            id: true
            firstName: true
          }
        > = {
          id: 1,
          firstName: "hello",
        }
        const selection2: ModelSelection<
          User,
          {
            id: true
            firstName: true
          }
        > = {
          id: 1,
          firstName: null,
        }
        const selection3: ModelSelection<
          User,
          {
            id: true
            lastName: true
          }
        > = {
          id: 1,
          lastName: undefined,
        }
        const selection4: ModelSelection<
          User,
          {
            id: true
            lastName: true
          }
        > = {
          id: 1,
          lastName: "Saw",
        }
        const selection5: ModelSelection<
          User,
          {
            id: true
            albums: {
              name: true
            }
          }
        > = {
          id: 1,
          albums: [{ name: "album #1" }],
        }
        const selection6: ModelSelection<
          User,
          {
            id: true
            albums: {
              name: true
            }
          }
        > = {
          id: 1,
          albums: null,
        }
        const selection7: ModelSelection<
          User,
          {
            id: true
            photos: {
              filename: true
            }
          }
        > = {
          id: 1,
          photos: [{ filename: "1.jpg" }, { filename: "2.jpg" }],
        }
        const selection8: ModelSelection<
          User,
          {
            id: true
            photos: {
              filename: true
            }
          }
        > = {
          id: 1,
          photos: undefined,
        }
        const selection9: ModelSelection<
          User,
          {
            id: true
            photoOrAlbum: {
              name: true
              filename: true
            }
          }
        > = {
          id: 1,
          photoOrAlbum: {
            name: "a",
            filename: "b",
            // error is expected because property wasn't selected
            // @ts-expect-error
            missingSelected: "d",
          },
        }
      })
    })
  })
})
