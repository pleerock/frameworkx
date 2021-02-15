#!/bin/bash

currentDir=${PWD}
publishedVersion=""
previousVersion=""
declare -a publishedPackageDirs=()
declare -a packageDirs=(
  "./packages/cli"
  "./packages/core"
  "./packages/fetcher"
  "./packages/graphql"
  "./packages/logger"
  "./packages/model"
  "./packages/node"
  "./packages/parser"
  "./packages/validator"
)

checkVersions() {
  cd "$currentDir"
  echo "checking if correct versions are set in every package"
  for packageDir in "${packageDirs[@]}"
  do
    cd "$packageDir"
    currentVersion="$(node -pe "require('./package.json').version")"
    if [[ "$previousVersion" == "" ]]
    then
      previousVersion="$currentVersion"
    else
      if [[ "$previousVersion" != "$currentVersion" ]]
      then
        echo "Packages have invalid versions ("$previousVersion" != "$currentVersion"). Please make sure all packages in the project has same version setup"
        exit
      fi
    fi
    cd "$currentDir"
  done
  echo "all packages have correct versions set up"
}

# we have a custom publishing process for the CLI package
# for this package we need to copy templates into project templateDirectory
# and publish package with these templates (templates are used for "init" command of CLI)
# after we publish package with templates, we remove them from the project
# --------------------------
publishCliPackage() {
  echo "> ./packages/cli"
  cd "./packages/cli"

  declare -a templateNames=(
    "monolith-template"
    "monorepo-template"
    "microservices-template"
  )

  # copy all templates into CLI project directory
  for templateDir in "${templateNames[@]}"
  do
    rm -rf _templates/"$templateDir"
    rsync -a ../../templates/"$templateDir" _templates --exclude _ --exclude node_modules --exclude tsconfig.tsbuildinfo --exclude package-lock.json
  done

  npm version patch
  npm publish --access public # --registry=https://registry.npmjs.com/
  #  npm publish --access public --registry=https://npm.pkg.github.com/
  publishedPackageDirs+=("./packages/cli")
  publishedVersion="$(node -pe "require('./package.json').version")"

  # remove copied templates
  rm -rf _templates

  cd "$currentDir"
}

# publish all other packages
# --------------------------
publishPackages() {
  for packageDir in "${packageDirs[@]}"
  do
    # skipping cli package because we had a separate publish process for that
    if [[ "$packageDir" = "./packages/cli" ]]
    then
      continue
    fi
    echo "> $packageDir"
    cd "$packageDir" # || exit

    npm version patch
    npm publish --access public # --registry=https://registry.npmjs.com/
  #  npm publish --access public --registry=https://npm.pkg.github.com/
    publishedPackageDirs+=($packageDir)
    publishedVersion="$(node -pe "require('./package.json').version")"

    cd "$currentDir" # || exit
  done

}

# unpublish packages if something went wrong
# ----------------------------
#unpublishPackages() {
#  echo "error occurred during publishing, unpublishing..."
#  for publishedPackageDir in "${publishedPackageDirs[@]}"
#  do
#    packageScope="@microframework"
#    packageName=${publishedPackageDir/.\/packages/$packageScope}
#    echo "UNPUBLISHING "$packageName"@"$publishedVersion""
#    npm unpublish "$packageName"@"$publishedVersion"
#  done
#  echo "All published packages were unpublished"
#}

# check if all packages were published
# ----------------------------
checkPackages() {
  if [[ "${#packageDirs[@]}" != "${#publishedPackageDirs[@]}" ]]
  then
    echo "Not all packages were published. Published "${#publishedPackageDirs[@]}" out of "${#packageDirs[@]}""
#    unpublishPackages
    exit
  fi
}

checkVersions
publishCliPackage
publishPackages
checkPackages
echo "All packages were successfully published to $publishedVersion"
