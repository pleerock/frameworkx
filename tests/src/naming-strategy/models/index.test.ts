import { parse } from "@microframework/parser"
import { DefaultNamingStrategy } from "@microframework/graphql"

describe("naming strategy > models", () => {
  const appMetadata = parse(__dirname + "/../app.ts")

  test("models - case #1", () => {
    const post = appMetadata.models.find(
      (model) => model.typeName === "PostType",
    )!

    const postId = post.properties.find(
      (property) => property.propertyPath === "PostType.id",
    )!

    const postStatus = post.properties.find(
      (property) => property.propertyPath === "PostType.status",
    )!

    const postCategory = post.properties.find(
      (property) => property.propertyPath === "PostType.categories",
    )!

    const categoryId = postCategory.properties.find(
      (property) => property.propertyPath === "PostType.categories.id",
    )!

    const categoryStatus = postCategory.properties.find(
      (property) => property.propertyPath === "PostType.categories.status",
    )!

    const categoryCounters = postCategory.properties.find(
      (property) => property.propertyPath === "PostType.categories.counters",
    )!

    const categoryCountersId = categoryCounters.properties.find(
      (property) => property.propertyPath === "PostType.categories.counters.id",
    )!

    const postIdType = DefaultNamingStrategy.unionTypeName(postId)
    const postStatusType = DefaultNamingStrategy.enumTypeName(postStatus)
    const postCategoryType = DefaultNamingStrategy.modelTypeName(postCategory)
    const categoryIdType = DefaultNamingStrategy.unionTypeName(categoryId)
    const categoryStatusType = DefaultNamingStrategy.enumTypeName(
      categoryStatus,
    )
    const categoryCountersType = DefaultNamingStrategy.modelTypeName(
      categoryCounters,
    )
    const categoryCountersIdType = DefaultNamingStrategy.unionTypeName(
      categoryCountersId,
    )

    expect(postIdType).toBe("PostTypeIdUnion")
    expect(postStatusType).toBe("PostTypeStatusEnum")
    expect(postCategoryType).toBe("PostTypeCategoriesModel")
    expect(categoryIdType).toBe("PostTypeCategoriesIdUnion")
    expect(categoryStatusType).toBe("PostTypeCategoriesStatusEnum")
    expect(categoryCountersType).toBe("PostTypeCategoriesCountersModel")
    expect(categoryCountersIdType).toBe("PostTypeCategoriesCountersIdUnion")
  })

  test("models - case #2", () => {
    const question = appMetadata.models.find(
      (model) => model.propertyName === "QuestionType",
    )!

    const questionId = question.properties.find(
      (property) => property.propertyPath === "QuestionType.id",
    )!

    const questionStatus = question.properties.find(
      (property) => property.propertyPath === "QuestionType.status",
    )!

    const questionCategory = question.properties.find(
      (model) => model.propertyPath === "QuestionType.category",
    )!

    const categoryId = questionCategory.properties.find(
      (property) => property.propertyPath === "QuestionType.category.id",
    )!

    const categoryStatus = questionCategory.properties.find(
      (property) => property.propertyPath === "QuestionType.category.status",
    )!

    const categoryCounters = questionCategory.properties.find(
      (property) => property.propertyPath === "QuestionType.category.counters",
    )!

    const categoryCountersId = categoryCounters.properties.find(
      (property) =>
        property.propertyPath === "QuestionType.category.counters.id",
    )!

    const questionType = DefaultNamingStrategy.modelTypeName(question)
    const questionIdType = DefaultNamingStrategy.unionTypeName(questionId)
    const questionStatusType = DefaultNamingStrategy.enumTypeName(
      questionStatus,
    )
    const categoryType = DefaultNamingStrategy.modelTypeName(questionCategory)
    const categoryIdType = DefaultNamingStrategy.unionTypeName(categoryId)
    const countersType = DefaultNamingStrategy.modelTypeName(categoryCounters)
    const categoryCountersIdType = DefaultNamingStrategy.modelTypeName(
      categoryCountersId,
    )
    const categoryStatusType = DefaultNamingStrategy.enumTypeName(
      categoryStatus,
    )

    expect(questionType).toBe("QuestionType")
    expect(questionIdType).toBe("QuestionTypeIdUnion")
    expect(questionStatusType).toBe("QuestionTypeStatusEnum")
    expect(categoryType).toBe("QuestionTypeCategoryModel")
    expect(categoryIdType).toBe("QuestionTypeCategoryIdUnion")
    expect(countersType).toBe("QuestionTypeCategoryCountersModel")
    expect(categoryCountersIdType).toBe("QuestionTypeCategoryCountersIdModel")
    expect(categoryStatusType).toBe("QuestionTypeCategoryStatusEnum")
  })

  test("models - case #3", () => {
    const car = appMetadata.models.find(
      (model) => model.propertyName === "CarType",
    )!

    const carBody = car.properties.find(
      (property) => property.propertyPath === "CarType.body",
    )!

    const carBodyId = carBody.properties.find(
      (property) => property.propertyPath === "CarType.body.id",
    )!

    const carBodyStatus = carBody.properties.find(
      (property) => property.propertyPath === "CarType.body.status",
    )!

    const carWheel = car.properties.find(
      (property) => property.propertyPath === "CarType.wheels",
    )!

    const carWheelCategory = carWheel.properties.find(
      (property) => property.propertyPath === "CarType.wheels.category",
    )!

    const categoryId = carWheelCategory.properties.find(
      (property) => property.propertyPath === "CarType.wheels.category.id",
    )!

    const categoryStatus = carWheelCategory.properties.find(
      (property) => property.propertyPath === "CarType.wheels.category.status",
    )!

    const categoryCounters = carWheelCategory.properties.find(
      (property) =>
        property.propertyPath === "CarType.wheels.category.counters",
    )!

    const categoryCountersId = categoryCounters.properties.find(
      (property) =>
        property.propertyPath === "CarType.wheels.category.counters.id",
    )!

    const carType = DefaultNamingStrategy.modelTypeName(car)
    const carBodyType = DefaultNamingStrategy.modelTypeName(carBody)
    const carBodyIdType = DefaultNamingStrategy.unionTypeName(carBodyId)
    const carBodyStatusType = DefaultNamingStrategy.enumTypeName(carBodyStatus)
    const carWheelType = DefaultNamingStrategy.modelTypeName(carWheel)
    const carWheelCategoryType = DefaultNamingStrategy.modelTypeName(
      carWheelCategory,
    )
    const carWheelCategoryIdType = DefaultNamingStrategy.modelTypeName(
      categoryId,
    )
    const carWheelCategoryStatusType = DefaultNamingStrategy.modelTypeName(
      categoryStatus,
    )
    const categoryCountersType = DefaultNamingStrategy.modelTypeName(
      categoryCounters,
    )
    const categoryCountersIdType = DefaultNamingStrategy.modelTypeName(
      categoryCountersId,
    )

    expect(carType).toBe("CarType")
    expect(carBodyType).toBe("CarTypeBodyModel")
    expect(carBodyIdType).toBe("CarTypeBodyIdUnion")
    expect(carBodyStatusType).toBe("CarTypeBodyStatusEnum")
    expect(carWheelType).toBe("CarTypeWheelsModel")
    expect(carWheelCategoryType).toBe("CarTypeWheelsCategoryModel")
    expect(carWheelCategoryIdType).toBe("CarTypeWheelsCategoryIdModel")
    expect(carWheelCategoryStatusType).toBe("CarTypeWheelsCategoryStatusModel")
    expect(categoryCountersType).toBe("CarTypeWheelsCategoryCountersModel")
    expect(categoryCountersIdType).toBe("CarTypeWheelsCategoryCountersIdModel")
  })
})
