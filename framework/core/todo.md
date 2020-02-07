* todo: rename "framework" to "packages"
* add Date support
* provide mechanism for allowing allowed queries (e.g. `options#allowedQueries`)
* for App add support of classes and interfaces as well
* maybe we don't need to specify list of models and inputs in App anymore? Or at least check if we can make it array back
* for classes we need to create instances (this is highly expected by users), need to solve this issue if we can

  /**
   * To improve resolvers performance when different property resolvers rely on the same data,
   * but this data has computation costs, we can use this method to execute computations
   * before resolving each property. Then we'll be able to access our properties in the resolver.
   *
   * todo
   */
  beforeResolve(callback: (context: Context) => any) {

  }
  
  