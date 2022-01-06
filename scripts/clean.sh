currentDir=${PWD}
declare -a projectDirs=(
  "./packages/cli"
  "./packages/core"
  "./packages/fetcher"
  "./packages/graphql"
  "./packages/logger"
  "./packages/model"
  "./packages/node"
  "./packages/parser"
  "./samples/complete-sample"
  "./templates/monolith-template"
  "./templates/monorepo-template/packages/common"
  "./templates/monorepo-template/packages/client"
  "./templates/monorepo-template/packages/server"
  "./templates/microservices-template/packages/gateway"
  "./templates/microservices-template/packages/category"
  "./templates/microservices-template/packages/post"
  "./templates/microservices-template/packages/user"
  "./tests"
)

if [ "$1" = "--hard" ] || [ "$1" = "hard" ]; then
  echo "Removing root node_modules..."
  rm -rf package-lock.json
  rm -rf node_modules
fi

echo "Removing typescript build files..."
if [ "$1" = "--hard" ]; then
  echo "Removing node_modules as well..."
fi

for dir in "${projectDirs[@]}"
do
  echo "> $dir"
  cd "$dir" || exit

  rm -rf _
  rm -rf tsconfig.tsbuildinfo
  if [ "$1" = "--hard" ] || [ "$1" = "hard" ]; then
    rm -rf node_modules
    rm -rf package-lock.json
  fi

  cd "$currentDir" || exit
done

echo "Done!"