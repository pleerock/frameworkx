import { CategoryType, PostType } from "./models"

export const CategoryList: CategoryType[] = [
  { id: 1, name: "category #1", posts: [] },
  { id: 2, name: "category #2", posts: [] },
  { id: 3, name: "category #3", posts: [] },
  { id: 4, name: "category #4", posts: [] },
  { id: 5, name: "category #5", posts: [] },
]

export const PostList: PostType[] = [
  {
    id: 1,
    title: "post #1",
    categories: CategoryList.filter((i) => i.id > 1),
    primaryCategory: CategoryList[0],
    secondaryCategory: CategoryList[0],
    active: true,
    likes: 1.2,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "post #2",
    categories: CategoryList.filter((i) => i.id > 2),
    primaryCategory: CategoryList[1],
    secondaryCategory: CategoryList[1],
    active: true,
    likes: 2.3,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "post #3",
    categories: CategoryList.filter((i) => i.id > 3),
    primaryCategory: CategoryList[1],
    secondaryCategory: null,
    active: true,
    likes: 5,
    createdAt: new Date(),
  },
]
