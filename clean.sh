currentDir=${PWD}
declare -a projectDirs=(
  "./packages/core"
  "./packages/parser"
  "./packages/node"
  "./packages/logger"
  "./packages/model"
  "./samples/class-sample"
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

  rm -rf _
  rm -rf tsconfig.tsbuildinfo
  if [ "$1" = "--hard" ] || [ "$1" = "hard" ]; then
    rm -rf node_modules
  fi

  cd "$currentDir" || exit
done

echo "Done!"