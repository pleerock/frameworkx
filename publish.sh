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
  npm publish --access public

  cd "$currentDir" || exit
done

echo "Published!"
