currentDir=${PWD}
declare -a projectDirs=(
  "./packages/cli"
  "./packages/core"
  "./packages/fetcher"
  "./packages/logger"
  "./packages/model"
  "./packages/node"
  "./packages/parser"
  "./packages/validator"
)

for dir in "${projectDirs[@]}"
do
  echo "> $dir"
  cd "$dir" || exit

  npm version patch
  npm publish --access public # --registry=https://registry.npmjs.com/
#  npm publish --access public --registry=https://npm.pkg.github.com/

  cd "$currentDir" || exit
done

echo "Published!"
