/**
 * Errors thrown in the app.
 */
export const Errors = {

    // errors on app file parsing
    appFileInvalid(fileName: string) {
        return new Error(`Cannot find a given "${fileName}" application file. Make sure its a proper TypeScript file.`)
    },
    appFileExportMissing() {
        return new Error(`Your application declaration file must contain a single exported type.`)
    },
    appFileTooManyExports() {
        return new Error(`Your application declaration file must contain only one exported node.`)
    },
    appFileNotTypeAlias() {
        return new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },

    // errors on app type parsing
    appTypeNotTypeReference() {
        throw new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },
    appTypeNoName() {
        throw new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },
    appTypeNotApplicationOptionsOf() {
        throw new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },
    appTypeInvalidArguments() {
        throw new Error(`"ApplicationOptionsOf" must define all application options, e.g. ApplicationOptionsOf<{ ...options... }>.`)
    },
    appType() {
        throw new Error(`"ApplicationOptionsOf" must define application options in a following format: ApplicationOptionsOf<{ ...options... }>.`)
    },

    // errors on app models
    appModelsInvalidSignature() {
        throw new Error(`"models" inside application options must be an object with models inside, e.g. "models: { User: UserModel, ... }".`)
    },
    appModelsEmptyObject() {
        throw new Error(`"models" inside application options must contain at least one model, e.g. { User: UserModel, ... }.`)
    },

}
