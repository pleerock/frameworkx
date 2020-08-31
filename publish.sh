currentDir=${PWD}
declare -a projectDirs=(
  "./packages/cli"
  "./packages/core"
  "./packages/parser"
  "./packages/node"
  "./packages/logger"
  "./packages/model"
  "./packages/fetcher"
)

for dir in "${projectDirs[@]}"
do
  echo "> $dir"
  cd "$dir" || exit

  npm version patch
  npm publish

  cd "$currentDir" || exit
done

echo "Published!"
