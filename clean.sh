currentDir=${PWD}
declare -a projectDirs=(
  "./framework/core"
  "./framework/parser"
  "./framework/node"
  "./framework/logger"
  "./framework/model"
  "./samples/basic-sample"
  "./samples/class-sample"
  "./samples/client-server-sample/client"
  "./samples/client-server-sample/common"
  "./samples/client-server-sample/server"
  "./samples/microservices-sample/post-module"
  "./tests"
)

if [ "$1" = "--hard" ] || [ "$1" = "hard" ]; then
  echo "Removing root node_modules..."
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

  rm -rf tsconfig.tsbuildinfo
  if [ "$1" = "--hard" ] || [ "$1" = "hard" ]; then
    rm -rf node_modules
  fi

  cd "$currentDir" || exit
done

echo "Done!"