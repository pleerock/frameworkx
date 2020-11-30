import { parse } from "@microframework/parser"
import { DefaultNamingStrategy } from "@microframework/graphql"

describe("naming strategy > inputs", () => {
  const appMetadata = parse(__dirname + "/../app.ts")

  test("inputs - case #1", () => {
    const post = appMetadata.inputs.find(
      (model) => model.typeName === "PostInput",
    )!

    const postStatus = post.properties.find(
      (property) => property.propertyPath === "PostInput.status",
    )!

    const postCategory = post.properties.find(
      (property) => property.propertyPath === "PostInput.categories",
    )!

    const categoryStatus = postCategory.properties.find(
      (property) => property.propertyPath === "PostInput.categories.status",
    )!

    const categoryCounters = postCategory.properties.find(
      (property) => property.propertyPath === "PostInput.categories.counters",
    )!

    const postStatusInput = DefaultNamingStrategy.enumTypeName(postStatus)
    const postCategoryInput = DefaultNamingStrategy.inputTypeName(postCategory)
    const categoryStatusInput = DefaultNamingStrategy.enumTypeName(
      categoryStatus,
    )
    const categoryCountersInput = DefaultNamingStrategy.inputTypeName(
      categoryCounters,
    )

    expect(postStatusInput).toBe("PostInputStatusEnum")
    expect(postCategoryInput).toBe("PostInputCategoriesInput")
    expect(categoryStatusInput).toBe("PostInputCategoriesStatusEnum")
    expect(categoryCountersInput).toBe("PostInputCategoriesCountersInput")
  })

  test("inputs - case #2", () => {
    const question = appMetadata.inputs.find(
      (model) => model.propertyName === "QuestionInput",
    )!

    const questionStatus = question.properties.find(
      (property) => property.propertyPath === "QuestionInput.status",
    )!

    const questionCategory = question.properties.find(
      (model) => model.propertyPath === "QuestionInput.category",
    )!

    const categoryStatus = questionCategory.properties.find(
      (property) => property.propertyPath === "QuestionInput.category.status",
    )!

    const categoryCounters = questionCategory.properties.find(
      (property) => property.propertyPath === "QuestionInput.category.counters",
    )!

    const questionInput = DefaultNamingStrategy.inputTypeName(question)
    const questionStatusInput = DefaultNamingStrategy.enumTypeName(
      questionStatus,
    )
    const categoryInput = DefaultNamingStrategy.inputTypeName(questionCategory)
    const countersInput = DefaultNamingStrategy.inputTypeName(categoryCounters)
    const categoryStatusInput = DefaultNamingStrategy.enumTypeName(
      categoryStatus,
    )

    expect(questionInput).toBe("QuestionInput")
    expect(questionStatusInput).toBe("QuestionInputStatusEnum")
    expect(categoryInput).toBe("QuestionInputCategoryInput")
    expect(countersInput).toBe("QuestionInputCategoryCountersInput")
    expect(categoryStatusInput).toBe("QuestionInputCategoryStatusEnum")
  })

  test("inputs - case #3", () => {
    const car = appMetadata.inputs.find(
      (model) => model.propertyName === "CarInput",
    )!

    const carBody = car.properties.find(
      (property) => property.propertyPath === "CarInput.body",
    )!

    const carBodyStatus = carBody.properties.find(
      (property) => property.propertyPath === "CarInput.body.status",
    )!

    const carWheel = car.properties.find(
      (property) => property.propertyPath === "CarInput.wheels",
    )!

    const carWheelCategory = carWheel.properties.find(
      (property) => property.propertyPath === "CarInput.wheels.category",
    )!

    const categoryStatus = carWheelCategory.properties.find(
      (property) => property.propertyPath === "CarInput.wheels.category.status",
    )!

    const categoryCounters = carWheelCategory.properties.find(
      (property) =>
        property.propertyPath === "CarInput.wheels.category.counters",
    )!

    const carInput = DefaultNamingStrategy.inputTypeName(car)
    const carBodyInput = DefaultNamingStrategy.inputTypeName(carBody)
    const carBodyStatusInput = DefaultNamingStrategy.enumTypeName(carBodyStatus)
    const carWheelInput = DefaultNamingStrategy.inputTypeName(carWheel)
    const carWheelCategoryInput = DefaultNamingStrategy.inputTypeName(
      carWheelCategory,
    )
    const carWheelCategoryStatusInput = DefaultNamingStrategy.inputTypeName(
      categoryStatus,
    )
    const categoryCountersInput = DefaultNamingStrategy.inputTypeName(
      categoryCounters,
    )

    expect(carInput).toBe("CarInput")
    expect(carBodyInput).toBe("CarInputBodyInput")
    expect(carBodyStatusInput).toBe("CarInputBodyStatusEnum")
    expect(carWheelInput).toBe("CarInputWheelsInput")
    expect(carWheelCategoryInput).toBe("CarInputWheelsCategoryInput")
    expect(carWheelCategoryStatusInput).toBe(
      "CarInputWheelsCategoryStatusInput",
    )
    expect(categoryCountersInput).toBe("CarInputWheelsCategoryCountersInput")
  })
})
